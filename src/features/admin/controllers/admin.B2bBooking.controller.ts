import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { AdminBtoBBookingServiceService } from "../services/admin.b2bBookingService.service";
import { B2BBookingSupportValidator } from "../../b2b/utils/validators/B2BBookingSupportValidator";

export class AdminBtoBBookingServiceController extends AbstractController {
  private services = new AdminBtoBBookingServiceService();
  private validators = new B2BBookingSupportValidator();
  constructor() {
    super();
  }
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
  // close support
  public closeSupport = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
      bodySchema: this.validators.closeSchema,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.closeSupport(req);
      res.status(code).json(rest);
    }
  );
}
