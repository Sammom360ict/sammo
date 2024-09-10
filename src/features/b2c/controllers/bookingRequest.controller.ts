import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import FlightBookingValidator from "../utils/validators/flightBooking.validator";
import BookingRequestService from "../services/bookingRequest.service";

class BookingRequestController extends AbstractController {
  private service = new BookingRequestService();
  private flightValidator = new FlightBookingValidator();
  constructor() {
    super();
  }
  // Flight booking controller
  public flightBooking = this.asyncWrapper.wrap(
    { bodySchema: this.flightValidator.pnrCreateSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.flightBooking(req);
      res.status(code).json(rest);
    }
  );
  // get all flight booking
  public getAllFlightBooking = this.asyncWrapper.wrap(
    { querySchema: this.flightValidator.getAllFlightBookingSchema },
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
}
export default BookingRequestController;
