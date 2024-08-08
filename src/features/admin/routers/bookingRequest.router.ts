import AbstractRouter from '../../../abstract/abstract.router';
import { BookingRequestController } from '../controllers/bookingRequest.controller';

export class BookingRequestRouter extends AbstractRouter {
  private controller = new BookingRequestController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // get list
    this.router
      .route('/')
      .get(this.controller.get);

    // get single
    this.router
      .route('/:id')
      .get(this.controller.getSingle)
      .patch(this.controller.update)
  }
}
