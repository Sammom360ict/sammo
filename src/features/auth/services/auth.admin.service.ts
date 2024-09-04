import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import Lib from "../../../utils/lib/lib";
import config from "../../../config/config";
import {
  ILoginPayload,
  IForgetPasswordPayload,
} from "../../common/commonUtils/types/commonTypes";

class AdminAuthService extends AbstractServices {
  //login
  public async loginService(req: Request) {
    const { email, password } = req.body as ILoginPayload;
    const model = this.Model.adminModel();
    const checkUser = await model.getSingleAdmin({ email });
    console.log(checkUser);
    if (!checkUser.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }

    const { password_hash: hashPass, role_id, ...rest } = checkUser[0];
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

    const admModel = this.Model.administrationModel();

    const role_permission = await admModel.getSingleRole({
      id: parseInt(role_id),
    });

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
    const token = Lib.createToken(token_data, config.JWT_SECRET_ADMIN, "48h");
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
      data: {
        ...rest,
        permissions: role_permission.length ? role_permission[0] : [],
      },
      token,
    };
  }

  //forget pass
  public async forgetPassword(req: Request) {
    const { token, email, password } = req.body as IForgetPasswordPayload;
    const token_verify: any = Lib.verifyToken(token, config.JWT_SECRET_ADMIN);

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
      const model = this.Model.adminModel();
      const get_admin = await model.getSingleAdmin({ email });
      await model.updateUserAdmin(
        { password_hash: hashed_pass },
        { id: get_admin[0].id }
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

export default AdminAuthService;
