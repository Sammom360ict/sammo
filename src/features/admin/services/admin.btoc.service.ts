import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";

export class AdminBtocService extends AbstractServices {
  //get users
  public async getUsers(req: Request) {
    const model = this.Model.userModel();
    const data = await model.getAllUser(req.query, true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data.data,
      total: data.total,
    };
  }

  //get user details
  public async getSingleUser(req: Request) {
    const id = Number(req.params.id);
    const model = this.Model.userModel();
    const data = await model.getProfileDetails({ id });
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const { password_hash, ...rest } = data[0];
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: rest,
    };
  }

  //edit user profile
  public async editUserProfile(req: Request) {
    const { id } = req.params;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const { username, first_name, last_name, gender, photo, status } = req.body;
    const model = this.Model.userModel();
    if (req.body.username) {
      const check_username = await model.getProfileDetails({
        username: req.body.username,
      });
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
    const update_profile = await model.updateProfile(
      { username, first_name, last_name, gender, photo, status },
      { id: Number(id) }
    );
    if (update_profile) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
        data: req.body,
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
