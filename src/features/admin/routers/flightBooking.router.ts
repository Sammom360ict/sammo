import AbstractRouter from '../../../abstract/abstract.router';
import adminFlightBookingController from '../controllers/flightBooking.controller';

class adminFlightBookingRouter extends AbstractRouter {
  private controller = new adminFlightBookingController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Get all flight booking
    this.router
      .route('/')
      .get(this.controller.getAllFlightBooking);

    // // ticket booking cancel
    // this.router.route('/cancel').post(this.controller.cancelFlightBooking);

    // Get single flight booking
    this.router.route('/:id').get(this.controller.getSingleFlightBooking)
    .post(this.controller.issueTicket)
    .delete(this.controller.cancelFlightBooking);
  }
}
export default adminFlightBookingRouter;
