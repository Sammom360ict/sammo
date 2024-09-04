import {
  IChangePasswordPayload,
  IProfile,
} from "../utils/types/profile.interfaces";
import AbstractServices from "../../../abstract/abstract.service";
import { Request } from "express";
import Lib from "../../../utils/lib/lib";

class AdminProfileService extends AbstractServices {
  //get profile
  public async getProfile(req: Request) {
    const { id } = req.admin;
    const model = this.Model.adminModel();
    const profile = await model.getSingleAdmin({ id });
    const { password_hash, created_by, role_id, ...rest } = profile[0];

    const admModel = this.Model.administrationModel();

    const role_permission = await admModel.getSingleRole({
      id: parseInt(role_id),
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: {
        ...rest,
        permissions: role_permission.length ? role_permission[0] : [],
      },
    };
  }

  //edit profile
  public async editProfile(req: Request) {
    const { id } = req.admin;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const { username, first_name, last_name, gender, photo } =
      req.body as IProfile;
    const model = this.Model.adminModel();
    if (req.body.username) {
      const check_username = await model.getSingleAdmin({
        username: req.body.username,
      });
      console.log(check_username);
      if (check_username.length) {
        if (Number(check_username[0].id) !== Number(id)) {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: this.ResMsg.USERNAME_EXISTS,
          };
        }
      }
    }
    const update_profile = await model.updateUserAdmin(
      { username, first_name, last_name, gender, photo },
      { id }
    );
    if (update_profile) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }

  //change password
  public async changePassword(req: Request) {
    const { id } = req.admin;
    const { old_password, new_password } = req.body as IChangePasswordPayload;

    const model = this.Model.adminModel();
    const admin_details = await model.getSingleAdmin({ id });
    if (!admin_details.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const verify_password = await Lib.compare(
      old_password,
      admin_details[0].password_hash
    );
    if (!verify_password) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.PASSWORD_DOES_NOT_MATCH,
      };
    }

    const hashed_password = await Lib.hashPass(new_password);
    const password_changed = await model.updateUserAdmin(
      { password_hash: hashed_password },
      { id }
    );
    if (password_changed) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.PASSWORD_CHANGED,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }
}

export default AdminProfileService;
