import { IProfile, IChangePasswordPayload } from '../utils/types/bookingProfile.interfaces';
import AbstractServices from '../../../abstract/abstract.service';
import { Request } from 'express';
import Lib from '../../../utils/lib/lib';

export default class BookingProfileService extends AbstractServices {
  //get profile
  public async getProfile(req: Request) {
    const { id } = req.user;
    const model = this.Model.userModel();
    const profile = await model.getProfileDetails({ id });
    console.log(profile);
    const { password_hash, ...rest } = profile[0];
    console.log(rest);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: rest,
    };
  }

  //edit profile
  public async editProfile(req: Request) {
    const { id } = req.user;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const { username, first_name, last_name, gender, photo } =
      req.body as IProfile;
    const model = this.Model.userModel();
    if(req.body.username){
      const check_username = await model.getProfileDetails({username:req.body.username});
      if(check_username.length){
        if(check_username[0].id!==id){
          return{
            success:false,
            code:this.StatusCode.HTTP_CONFLICT,
            message: this.ResMsg.USERNAME_EXISTS,
          }
        }
      }
    }
    const update_profile = await model.updateProfile(
      { username, first_name, last_name, gender, photo },
      { id }
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

  //change password
  public async changePassword(req: Request) {
    const { id } = req.user;
    const { old_password, new_password } = req.body as IChangePasswordPayload;

    const model = this.Model.userModel();
    const user_details = await model.getProfileDetails({ id });
    if (!user_details.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const verify_password = await Lib.compare(
      old_password,
      user_details[0].password_hash
    );
    if (!verify_password) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.PASSWORD_DOES_NOT_MATCH,
      };
    }

    const hashed_password = await Lib.hashPass(new_password);
    const password_changed = await model.updateProfile(
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
