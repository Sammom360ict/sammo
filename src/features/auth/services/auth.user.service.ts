import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import Lib from "../../../utils/lib/lib";
import config from "../../../config/config";
import {
  ILoginPayload,
  IForgetPasswordPayload,
} from "../../common/commonUtils/types/commonTypes";
import GoogleAuth from "../../../utils/other/googleAuth";
import { verifyFacebookToken } from "../../../utils/other/fbAuth";

class UserAuthService extends AbstractServices {
  //registration service
  public async registrationService(req: Request) {
    return this.db.transaction(async (trx) => {
      const files = (req.files as Express.Multer.File[]) || [];
      if (files?.length) {
        req.body[files[0].fieldname] = files[0].filename;
      }

      const { password, email, phone_number, username, ...rest } = req.body;
      const model = this.Model.userModel(trx);
      //check users email and phone number and username
      const check_user = await model.getProfileDetails({
        email,
        phone_number,
        username,
      });
      if (check_user.length) {
        if (check_user[0].email === email) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: this.ResMsg.EMAIL_EXISTS,
          };
        } else if (check_user[0].username === username) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: this.ResMsg.USERNAME_EXISTS,
          };
        } else {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: this.ResMsg.PHONE_EXISTS,
          };
        }
      }
      rest.email = email;
      rest.phone_number = phone_number;
      rest.username = username;
      //password hashing
      const hashedPass = await Lib.hashPass(password);
      //register user
      const registration = await model.registerUser({
        password_hash: hashedPass,
        ...rest,
      });

      //retrieve token data
      const tokenData = {
        id: registration[0].id,
        username: rest.username,
        first_name: rest.first_name,
        last_name: rest.last_name,
        gender: rest.gender,
        email: rest.email,
        phone_number: rest.phone_number,
        photo: rest.photo,
        is_verified: false,
        status: true,
        create_date: new Date(),
      };

      const token = Lib.createToken(tokenData, config.JWT_SECRET_USER, "48h");

      if (registration.length) {
        return {
          success: true,
          code: this.StatusCode.HTTP_SUCCESSFUL,
          message: this.ResMsg.HTTP_SUCCESSFUL,
          data: { ...tokenData },
          token,
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: this.ResMsg.HTTP_BAD_REQUEST,
        };
      }
    });
  }

  //registration service
  public async loginWithGoogle(req: Request) {
    return this.db.transaction(async (trx) => {
      const { accessToken, name, email, image } = req.body; // Assuming the token is sent in the request body

      if (!accessToken) {
        return {
          success: false,
          code: this.StatusCode.HTTP_UNAUTHORIZED,
          message: "Access token required",
        };
      }

      // Verify Google access token
      const user = await new GoogleAuth().verifyAccessToken(accessToken);

      const model = this.Model.userModel(trx);
      //check users email and phone number and username
      const check_user = await model.getProfileDetails({
        email,
      });

      let userId = check_user.length && check_user[0].id;
      if (!check_user.length) {
        //register user
        const registration = await model.registerUser({
          first_name: name,
          email,
        });
        userId = registration[0].id;
      }

      //retrieve token data
      const tokenData = {
        id: userId,
        first_name: name,
        email,
        photo: check_user.length ? check_user[0].photo : null,
        is_verified: true,
        status: true,
        create_date: new Date(),
      };

      const token = Lib.createToken(tokenData, config.JWT_SECRET_USER, "48h");

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
        data: tokenData,
        token,
      };
    });
  }

  //registration service
  public async loginWithFB(req: Request) {
    return this.db.transaction(async (trx) => {
      const { accessToken, name, email, image } = req.body; // Assuming the token is sent in the request body

      if (!accessToken) {
        return {
          success: false,
          code: this.StatusCode.HTTP_UNAUTHORIZED,
          message: "Access token required",
        };
      }

      // Verify Google access token
      const user = await verifyFacebookToken(accessToken);

      console.log({ user });

      const model = this.Model.userModel(trx);
      //check users email and phone number and username
      const check_user = await model.getProfileDetails({
        email: user.email,
      });

      let userId = check_user.length && check_user[0].id;
      if (!check_user.length) {
        //register user
        const registration = await model.registerUser({
          first_name: name,
          email,
        });
        userId = registration[0].id;
      }

      //retrieve token data
      const tokenData = {
        id: userId,
        first_name: name,
        email,
        photo: check_user.length ? check_user[0].photo : null,
        is_verified: true,
        status: true,
      };

      const token = Lib.createToken(tokenData, config.JWT_SECRET_USER, "48h");

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
        token,
        data: tokenData,
      };
    });
  }

  //login
  public async loginService(req: Request) {
    const { email, password } = req.body as ILoginPayload;
    const model = this.Model.userModel();
    const checkUser = await model.getProfileDetails({ email });
    if (!checkUser.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }
    console.log({ checkUser });
    const { password_hash: hashPass, ...rest } = checkUser[0];
    const checkPass = await Lib.compare(password, hashPass);

    if (!checkPass) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }

    if (rest.status === false) {
      return {
        success: false,
        code: this.StatusCode.HTTP_FORBIDDEN,
        message: "Your account has been disabled",
      };
    }

    const token_data = {
      id: rest.id,
      username: rest.username,
      first_name: rest.first_name,
      last_name: rest.last_name,
      gender: rest.gender,
      phone_number: rest.phone_number,
      role_id: rest.role_id,
      photo: rest.photo,
      status: rest.status,
      email: rest.email,
    };
    const token = Lib.createToken(token_data, config.JWT_SECRET_USER, "48h");
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
      data: rest,
      token,
    };
  }

  //forget pass
  public async forgetPassword(req: Request) {
    const { token, email, password } = req.body as IForgetPasswordPayload;
    const token_verify: any = Lib.verifyToken(token, config.JWT_SECRET_USER);

    if (!token_verify) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNAUTHORIZED,
        message: this.ResMsg.HTTP_UNAUTHORIZED,
      };
    }

    const { email: verify_email } = token_verify;
    if (email === verify_email) {
      const hashed_pass = await Lib.hashPass(password);
      const model = this.Model.userModel();
      const get_user = await model.getProfileDetails({ email });
      await model.updateProfile(
        { password_hash: hashed_pass },
        { id: get_user[0].id }
      );
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.PASSWORD_CHANGED,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_FORBIDDEN,
        message: this.StatusCode.HTTP_FORBIDDEN,
      };
    }
  }
}

export default UserAuthService;
