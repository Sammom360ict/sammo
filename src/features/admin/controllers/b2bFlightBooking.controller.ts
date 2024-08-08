import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import adminB2BFlightBookingService from '../services/b2bFlightBooking.service';

class adminB2BFlightBookingController extends AbstractController {
  private service = new adminB2BFlightBookingService();

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
    { paramSchema: this.commonValidator.singleParamStringValidator('id') },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.getSingleFlightBooking(req);

      res.status(code).json(rest);
    }
  );

  // issue ticket
  public issueTicket = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamStringValidator('id') },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.ticketIssue(req);

      res.status(code).json(rest);
    }
  );

  // cancel flight booking
  public cancelFlightBooking = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamStringValidator('id') },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.cancelFlightBooking(req);

      res.status(code).json(rest);
    }
  );
}
export default adminB2BFlightBookingController;
