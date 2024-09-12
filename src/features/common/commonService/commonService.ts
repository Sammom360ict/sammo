import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { IGetOTPPayload } from "../../../utils/interfaces/common/commonInterface";
import {
  OTP_EMAIL_SUBJECT,
  OTP_FOR,
  OTP_TYPE_FORGET_ADMIN,
  OTP_TYPE_FORGET_AGENT,
  OTP_TYPE_FORGET_USER,
  OTP_TYPE_VERIFY_USER,
  SABRE_TOKEN_ENV,
} from "../../../utils/miscellaneous/constants";
import Lib from "../../../utils/lib/lib";
import { sendEmailOtpTemplate } from "../../../utils/templates/sendEmailOtp";
import ResMsg from "../../../utils/miscellaneous/responseMessage";
import config from "../../../config/config";
import {
  IAirlineFilterQuery,
  IAirportFilterQuery,
  IVisaFilterQuery,
} from "../commonUtils/types/commonTypes";
import qs from "qs";
import { GET_TOKEN_ENDPOINT } from "../../../utils/miscellaneous/sabreApiEndpoints";
import axios from "axios";
import { IArticleFilterQuery } from "../../../utils/interfaces/article/articleInterface";

class commonService extends AbstractServices {
  constructor() {
    super();
  }

  // Get Sebre token
  public async getSabreToken() {
    try {
      let data = qs.stringify({
        grant_type: "password",
        username: config.SABRE_USERNAME,
        password: config.SABRE_PASSWORD,
      });

      let axiosConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${config.SABRE_URL}/${GET_TOKEN_ENDPOINT}`,
        headers: {
          Authorization: `Basic ${config.SABRE_AUTH_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      axios
        .request(axiosConfig)
        .then(async (response) => {
          const data = response.data;

          const authModel = this.Model.commonModel();
          await authModel.updateEnv(SABRE_TOKEN_ENV, data.access_token);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  //send email otp service
  public async sendOtpToEmailService(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { email, type } = req.body as IGetOTPPayload;

      if (type === OTP_TYPE_FORGET_USER) {
        // --check if the user exist
        const userModel = this.Model.userModel();
        const checkuser = await userModel.getProfileDetails({ email });
        if (!checkuser.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "No user has been found with this email",
          };
        }
      } else if (type === OTP_TYPE_FORGET_ADMIN) {
        const model = this.Model.adminModel(trx);
        const admin_details = await model.getSingleAdmin({ email });
        if (!admin_details.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
          };
        }
      } else if (type === OTP_TYPE_VERIFY_USER) {
        const userModel = this.Model.userModel();
        const checkUser = await userModel.getProfileDetails({ email });

        if (!checkUser.length || checkUser[0].is_verified) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "No unverified user found.",
          };
        }
      } else if (type === OTP_TYPE_FORGET_AGENT) {
        const agentModel = this.Model.agencyModel();
        const checkAgent = await agentModel.getSingleUser({ email });
        if (!checkAgent.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "No user found.",
          };
        }
      }

      const commonModel = this.Model.commonModel(trx);
      const checkOtp = await commonModel.getOTP({ email: email, type: type });

      if (checkOtp.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_GONE,
          message: this.ResMsg.THREE_TIMES_EXPIRED,
        };
      }

      const otp = Lib.otpGenNumber(6);
      const hashed_otp = await Lib.hashPass(otp);

      try {
        const [send_email] = await Promise.all([
          email
            ? Lib.sendEmail(
                email,
                OTP_EMAIL_SUBJECT,
                sendEmailOtpTemplate(otp, OTP_FOR)
              )
            : undefined,
        ]);

        if (send_email) {
          await commonModel.insertOTP({
            hashed_otp: hashed_otp,
            email: email,
            type: type,
          });

          return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: this.ResMsg.OTP_SENT,
            data: {
              email,
            },
          };
        } else {
          return {
            success: false,
            code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
            message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
          };
        }
      } catch (error) {
        console.error("Error sending email or SMS:", error);
        return {
          success: false,
          code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
          message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
        };
      }
    });
  }

  //match email otp service
  public async matchEmailOtpService(req: Request) {
    return this.db.transaction(async (trx) => {
      const { email, otp, type } = req.body;
      const commonModel = this.Model.commonModel(trx);
      const userModel = this.Model.userModel(trx);
      const agentModel = this.Model.agencyModel(trx);
      const checkOtp = await commonModel.getOTP({ email, type });

      if (!checkOtp.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_FORBIDDEN,
          message: ResMsg.OTP_EXPIRED,
        };
      }

      const { id: email_otp_id, otp: hashed_otp, tried } = checkOtp[0];

      if (tried > 3) {
        return {
          success: false,
          code: this.StatusCode.HTTP_GONE,
          message: this.ResMsg.TOO_MUCH_ATTEMPT,
        };
      }

      const otpValidation = await Lib.compare(otp.toString(), hashed_otp);

      if (otpValidation) {
        await commonModel.updateOTP(
          {
            tried: tried + 1,
            matched: 1,
          },
          { id: email_otp_id }
        );

        //--change it for member
        let secret = config.JWT_SECRET_ADMIN;
        if (type === OTP_TYPE_FORGET_USER) {
          secret = config.JWT_SECRET_USER;
        } else if (type === OTP_TYPE_VERIFY_USER) {
          const checkUser = await userModel.getProfileDetails({ email });

          if (!checkUser.length || checkUser[0].is_verified) {
            return {
              success: false,
              code: this.StatusCode.HTTP_NOT_FOUND,
              message: "No unverified user found.",
            };
          }

          await userModel.updateProfile(
            { is_verified: true },
            { id: checkUser[0].id }
          );

          return {
            success: true,
            code: this.StatusCode.HTTP_ACCEPTED,
            message: "User successfully verified.",
          };
        } else if (type === OTP_TYPE_FORGET_AGENT) {
          secret = config.JWT_SECRET_AGENT;
        }

        const token = Lib.createToken(
          {
            email: email,
            type: type,
          },
          secret,
          "5m"
        );

        return {
          success: true,
          code: this.StatusCode.HTTP_ACCEPTED,
          message: this.ResMsg.OTP_MATCHED,
          token,
        };
      } else {
        await commonModel.updateOTP(
          {
            tried: tried + 1,
          },
          { id: email_otp_id }
        );

        return {
          success: false,
          code: this.StatusCode.HTTP_UNAUTHORIZED,
          message: this.ResMsg.OTP_INVALID,
        };
      }
    });
  }

  //get all country
  public async getAllCountry(req: Request) {
    const model = this.Model.commonModel();
    const country_list = await model.getAllCountry();
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: country_list,
    };
  }

  //get all city
  public async getAllCity(req: Request) {
    const country_id = req.query.country_id as unknown as number;
    const limit = req.query.limit as unknown as number;
    const skip = req.query.skip as unknown as number;
    const name = req.query.name as string;
    const model = this.Model.commonModel();
    const city_list = await model.getAllCity(country_id, limit, skip, name);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: city_list,
    };
  }

  //get all airport
  public async getAllAirport(req: Request) {
    const { country_id, name, limit, skip } = req.query as IAirportFilterQuery;
    const model = this.Model.commonModel();
    const get_airport = await model.getAllAirport(
      { country_id, name, limit, skip },
      true
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total: get_airport.total,
      data: get_airport.data,
    };
  }

  //get all airlines
  public async getAllAirlines(req: Request) {
    const { code, name, limit, skip } = req.query as IAirlineFilterQuery;
    const model = this.Model.commonModel();
    const get_airlines = await model.getAllAirline(
      { code, name, limit, skip },
      true
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total: get_airlines.total,
      data: get_airlines.data,
    };
  }

  //get all visa list
  public async getAllVisaCountryList(req: Request) {
    let { limit, skip } = req.query as IVisaFilterQuery;
    const model = this.Model.VisaModel();
    const data = await model.getAllVisaCountryList({
      status: true,
      limit,
      skip,
    });

    console.log({ data });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get all visa list
  public async getAllVisaList(req: Request) {
    let { country_id, limit, skip } = req.query as IVisaFilterQuery;
    const model = this.Model.VisaModel();
    const data = await model.get(
      { country_id, status: true, limit, skip },
      true
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single visa
  public async getSingleVisa(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.single(Number(id), true);
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    } else {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: data[0],
      };
    }
  }

  //get article list
  public async getArticleList(req: Request) {
    const { title, status, limit, skip, deleted } =
      req.query as IArticleFilterQuery;

    const data = await this.Model.articleModel().getArticleList({
      title,
      status,
      limit,
      skip,
      deleted,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single article
  public async getSingleArticle(req: Request) {
    const article_slug = req.params.slug;

    const data = await this.Model.articleModel().getSingleArticle({
      slug: article_slug,
    });

    if (!data.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: data[0],
    };
  }

  //get all offer
  public async getAllOffer(req: Request) {
    const { limit, skip, status, name } = req.query;
    const data = await this.Model.promotionModel().getOfferList({
      limit: Number(limit),
      skip: Number(skip),
      status: "1",
      name: name as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single offer
  public async getSingleOffer(req: Request) {
    const data = await this.Model.promotionModel().getSingleOffer({
      slug: req.params.slug,
    });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }
}
export default commonService;
