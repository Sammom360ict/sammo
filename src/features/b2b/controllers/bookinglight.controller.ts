import AbstractController from "../../../abstract/abstract.controller";
import { Request, Response } from "express";
import BookingFlightService from "../services/bookinglight.service";
import BookingFlightValidator from "../utils/validators/bookingFlight.validator";

export default class BookingFlightController extends AbstractController {
  private service = new BookingFlightService();
  private validator = new BookingFlightValidator();
  constructor() {
    super();
  }

  // Search flight
  public flightSearch = this.asyncWrapper.wrap(
    { bodySchema: this.validator.flightSearchSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.flightSearch(req);

      res.status(code).json(rest);
    }
  );

  // Filter flight
  public flightFilter = this.asyncWrapper.wrap(
    { querySchema: this.validator.flightFilterSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.flightFilter(req);

      res.status(code).json(rest);
    }
  );

  // revalidate flight
  public revalidate = this.asyncWrapper.wrap(
    { paramSchema: this.validator.flightRevalidateSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.revalidate(req);

      res.status(code).json(rest);
    }
  );

  // flight revalidate version 2.0
  public revalidatedFlightV2 = this.asyncWrapper.wrap(
    { bodySchema: this.validator.flightRevalidateSchemaV2 },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.flightRevalidateV2(req);

      res.status(code).json(rest);
    }
  );
}
