import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { BtoBBookingServiceService } from "../services/bookingService.service";
import { B2BBookingSupportValidator } from "../utils/validators/B2BBookingSupportValidator";

class BtoBBookingServiceController extends AbstractController {
  private services = new BtoBBookingServiceService();
  private validators = new B2BBookingSupportValidator();
  constructor() {
    super();
  }

  // create
  public createSupport = this.asyncWrapper.wrap(
    { bodySchema: this.validators.createSupportSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.createSupport(req);
      res.status(code).json(rest);
    }
  );
  // get
  public getList = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getList(req);
      res.status(code).json(rest);
    }
  );
  // get single
  public getDetails = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getDetails(req);
      res.status(code).json(rest);
    }
  );
  // create message
  public createMessage = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
      bodySchema: this.validators.createMessageSchema,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.createMessage(req);
      res.status(code).json(rest);
    }
  );
  // // close support
  // public closeSupport = this.asyncWrapper.wrap(
  //   { paramSchema: this.commonValidator.singleParamValidator() },
  //   async (req: Request, res: Response) => {
  //     const { code, ...rest } = await this.services.closeSupport(req);
  //     res.status(code).json(rest);
  //   }
  // );
}

export default BtoBBookingServiceController;
