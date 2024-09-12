import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { BookingRequestService } from "../services/bookingRequest.service";
import AdminBookingRequestValidator from "../utils/validators/bookingRequest.validator";

export class BookingRequestController extends AbstractController {
  private services = new BookingRequestService();
  private validators = new AdminBookingRequestValidator();
  constructor() {
    super();
  }

  // get
  public get = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.get(req);
      res.status(code).json(rest);
    }
  );

  // get single
  public getSingle = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getSingle(req);
      res.status(code).json(rest);
    }
  );

  // update
  public update = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
      bodySchema: this.validators.updateBookingRequestApplication,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.update(req);
      res.status(code).json(rest);
    }
  );
}
