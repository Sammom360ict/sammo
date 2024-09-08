import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import AdminB2BFlightBookingService from "../services/b2bFlightBooking.service";
import AdminBookingRequestValidator from "../utils/validators/bookingRequest.validator";

class AdminB2BFlightBookingController extends AbstractController {
  private service = new AdminB2BFlightBookingService();
  private validator = new AdminBookingRequestValidator();

  constructor() {
    super();
  }

  // get all flight booking
  public getAllFlightBooking = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.getAllFlightBooking(req);

      res.status(code).json(rest);
    }
  );

  // get single flight booking
  public getSingleFlightBooking = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamStringValidator("id") },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.getSingleFlightBooking(req);

      res.status(code).json(rest);
    }
  );

  // issue ticket
  public issueTicket = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamStringValidator("id") },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.ticketIssue(req);

      res.status(code).json(rest);
    }
  );

  // issue ticket
  public manualIssueTicket = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamStringValidator("id"),
      bodySchema: this.validator.manualTicketIssueValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.manualIssueTicket(req);
      res.status(code).json(rest);
    }
  );

  // cancel flight booking
  public cancelFlightBooking = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamStringValidator("id") },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.cancelFlightBooking(req);

      res.status(code).json(rest);
    }
  );
}
export default AdminB2BFlightBookingController;
