import {
  IProfile,
  IChangePasswordPayload,
} from "../utils/types/bookingProfile.interfaces";
import AbstractServices from "../../../abstract/abstract.service";
import { Request } from "express";
import Lib from "../../../utils/lib/lib";

export default class BookingProfileService extends AbstractServices {
  //get profile
  public async getProfile(req: Request) {
    const { id, agency_id } = req.agency;
    const model = this.Model.agencyModel();
    const profile = await model.getSingleUser({ id });
    console.log(profile);
    const { hashed_password, ...rest } = profile[0];
    const agency_model = this.Model.agencyModel();
    const balance = await agency_model.getTotalDeposit(agency_id);
    rest.balance = balance;
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: rest,
    };
  }

  //edit profile
  public async editProfile(req: Request) {
    const { id } = req.agency;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const model = this.Model.agencyModel();

    const update_profile = await model.updateAgencyUser(req.body, id);
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

  //change password
  public async changePassword(req: Request) {
    const { id } = req.agency;
    const { old_password, new_password } = req.body as IChangePasswordPayload;

    const model = this.Model.agencyModel();
    const user_details = await model.getSingleUser({ id });
    if (!user_details.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const verify_password = await Lib.compare(
      old_password,
      user_details[0].hashed_password
    );
    if (!verify_password) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.PASSWORD_DOES_NOT_MATCH,
      };
    }

    const hashed_password = await Lib.hashPass(new_password);
    const password_changed = await model.updateAgencyUser(
      { hashed_password: hashed_password },
      id
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
