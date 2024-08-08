import BookingProfileValidator from '../utils/validators/bookingProfile.validator';
import AbstractController from '../../../abstract/abstract.controller';
import { Request, Response } from 'express';
import BookingProfileService from '../services/bookingProfile.service';

export default class BookingProfileController extends AbstractController {
  private profileService = new BookingProfileService();
  private validator = new BookingProfileValidator();

  constructor() {
    super();
  }

  //get profile
  public getProfile = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.profileService.getProfile(req);
      res.status(code).json(data);
    }
  );

  //edit profile
  public editProfile = this.asyncWrapper.wrap(
    { bodySchema: this.validator.editProfile },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.profileService.editProfile(req);
      res.status(code).json(data);
    }
  );

  //change password
  public changePassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.changePassInputValidation },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.profileService.changePassword(req);
      res.status(code).json(data);
    }
  );
}
