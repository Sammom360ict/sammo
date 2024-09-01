import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { AdminBtocService } from "../services/admin.btoc.service";
import AdminBtocValidator from "../utils/validators/admin.btoc.validator";

export class AdminBtocController extends AbstractController {
  private service = new AdminBtocService();
  private validator = new AdminBtocValidator();

  //get users
  public getUsers = this.asyncWrapper.wrap(
    { querySchema: this.validator.getUsersFilterValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getUsers(req);
      res.status(code).json(data);
    }
  );

  //get user single
  public getSingleUser = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleUser(req);
      res.status(code).json(data);
    }
  );

  //edit user profile
  public editUserProfile = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
      bodySchema: this.validator.editUserProfileValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.editUserProfile(req);
      res.status(code).json(data);
    }
  );
}
