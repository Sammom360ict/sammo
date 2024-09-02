import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import AdminAuthService from "../services/auth.admin.service";
import UserAuthService from "../services/auth.user.service";

class UserAuthController extends AbstractController {
  private UserAuthService = new UserAuthService();
  constructor() {
    super();
  }

  //register
  public registration = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.registerValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.UserAuthService.registrationService(
        req
      );
      res.status(code).json(data);
    }
  );

  //register
  public loginWithGoogle = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginWithGoogleValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.UserAuthService.loginWithGoogle(req);
      res.status(code).json(data);
    }
  );

  //register
  public loginWithFB = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginWithGoogleValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.UserAuthService.loginWithGoogle(req);
      res.status(code).json(data);
    }
  );

  // login
  public login = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.UserAuthService.loginService(req);
      res.status(code).json(data);
    }
  );

  // forget pass
  public forgetPassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.commonForgetPassInputValidation },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.UserAuthService.forgetPassword(req);
      res.status(code).json(data);
    }
  );
}

export default UserAuthController;
