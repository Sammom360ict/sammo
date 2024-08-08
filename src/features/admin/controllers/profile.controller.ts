import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import AdminProfileService from '../services/profile.service';
import profileValidator from '../utils/validators/profile.validator';

class AdminProfileController extends AbstractController {
  private profileService = new AdminProfileService();
  private profileValidator = new profileValidator();

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
    { bodySchema: this.profileValidator.editProfile },
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

export default AdminProfileController;
