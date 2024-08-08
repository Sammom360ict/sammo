import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import AgentAuthService from '../services/auth.agent.service';

class AgentAuthController extends AbstractController {
  private AgentAuthService = new AgentAuthService();
  constructor() {
    super();
  }

  //admin login
  public login = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AgentAuthService.loginService(req);
      res.status(code).json(data);
    }
  );

  //admin forget pass
  public forgetPassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.commonForgetPassInputValidation },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AgentAuthService.forgetPassword(req);
      res.status(code).json(data);
    }
  );


}

export default AgentAuthController;
