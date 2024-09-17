import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { PaymentService } from "../services/adminPayment.service";

export class PaymentController extends AbstractController {
  private services = new PaymentService();
  constructor() {
    super();
  }

  //insert agency credit
  public insertAgencyCredit = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.createAirportSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.insertAgencyCredit(req);
      res.status(code).json(data);
    }
  );

  //get all airport
  public getAllAirport = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.airportFilterSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.getAllAirport(req);
      res.status(code).json(data);
    }
  );

  //update airport
  public updateAirport = this.asyncWrapper.wrap(
    {
      bodySchema: this.commonValidator.updateAirportSchema,
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.updateAirport(req);
      res.status(code).json(data);
    }
  );

  //delete airport
  public deleteAirport = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.deleteAirport(req);
      res.status(code).json(data);
    }
  );
}
