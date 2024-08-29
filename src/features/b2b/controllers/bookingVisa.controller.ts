import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { VisaValidator } from "../utils/validators/bookingVisa.validator";
import { B2BVisaService } from "../services/bookingVisa.service";

export class B2BVisaController extends AbstractController {
  private service = new B2BVisaService();
  private validator = new VisaValidator();
  //create application
  public createApplication = this.asyncWrapper.wrap(
    { bodySchema: this.validator.applicationSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createVisaApplication(req);
      res.status(code).json(data);
    }
  );

  //get applications
  public getApplicationList = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getApplicationList(req);
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
