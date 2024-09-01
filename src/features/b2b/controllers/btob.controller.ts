import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { BtobService } from "../services/btob.service";
import { BtobValidator } from "../utils/validators/btob.validator";

export class BtobController extends AbstractController {
  private service = new BtobService();
  private validator = new BtobValidator();
  //create application
  public insertDeposit = this.asyncWrapper.wrap(
    { bodySchema: this.validator.insertDeposit },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.insertDeposit(req);
      res.status(code).json(data);
    }
  );

  //get applications
  public getAllDepositRequestList = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllDepositRequestList(
        req
      );
      res.status(code).json(data);
    }
  );

  //get single application
  public getSingleApplication = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleApplication(req);
      res.status(code).json(data);
    }
  );
}
