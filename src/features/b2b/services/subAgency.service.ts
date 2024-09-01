import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import Lib from "../../../utils/lib/lib";
import { ICreateAgencyPayload } from "../../../utils/interfaces/agent/agency.interface";

export class BtoBSubAgencyService extends AbstractServices {
  constructor() {
    super();
  }

  // Create agency
  public async create(req: Request) {
    return this.db.transaction(async (trx) => {
      const { agency_id, id } = req.agency;
      const {
        agency_name,
        agency_email,
        agency_phone,
        commission,
        user_name,
        user_email,
        user_password,
        user_phone,
      } = req.body;

      const files = (req.files as Express.Multer.File[]) || [];
      const agencyModel = this.Model.agencyModel(trx);

      const agencyBody: ICreateAgencyPayload = {
        agency_name,
        email: agency_email,
        phone: agency_phone,
        commission,
        created_by: id,
        ref_id: agency_id,
      };

      const checkEmail = await agencyModel.getSingleUser({ email: user_email });

      if (checkEmail.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Email already exist.",
        };
      }

      const hashed_password = await Lib.hashPass(user_password);

      const userBody: any = {
        name: user_name,
        email: user_email,
        hashed_password,
        mobile_number: user_phone,
      };

      files.forEach((item) => {
        if (item.fieldname === "agency_logo") {
          agencyBody["agency_logo"] = item.filename;
        } else if (item.fieldname === "user_photo") {
          userBody["photo"] = item.filename;
        }
      });

      const agency = await agencyModel.createAgency(agencyBody);

      userBody["agency_id"] = agency[0].id;

      await agencyModel.createAgencyUser(userBody);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
        data: {
          id: agency[0].id,
          logo: agencyBody.agency_logo,
          user_photo: userBody.photo,
        },
      };
    });
  }

  // get agency
  public async get(req: Request) {
    const { name, status, limit, skip } = req.query;
    const { agency_id } = req.agency;
    const agencyModel = this.Model.agencyModel();
    const { data, total } = await agencyModel.getAgency({
      ref_id: agency_id,
      name: name as string,
      status: status as string,
      limit: limit as unknown as number,
      skip: skip as unknown as number,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }

  // get single agency
  public async getSingle(req: Request) {
    const { id } = req.params;
    const { agency_id } = req.agency;
    const { limit, skip } = req.query;
    const agencyModel = this.Model.agencyModel();

    const data = await agencyModel.getSingleAgency(Number(id), agency_id);

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const users = await agencyModel.getUser({
      agency_id: Number(id),
      limit: limit as unknown as number,
      skip: skip as unknown as number,
    });

    const { ref_id, ...restAgencyData } = data[0];

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: {
        ...restAgencyData,
        users,
      },
    };
  }
}
