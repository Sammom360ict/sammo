import AbstractRouter from "../../../abstract/abstract.router";
import flightBookingController from "../controllers/flightBooking.controller";

class BtobFlightBookingRouter extends AbstractRouter {
  private controller = new flightBookingController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Get all flight booking
    this.router
      .route("/")
      .post(this.controller.flightBooking)
      .get(this.controller.getAllFlightBooking);

    // Get single flight booking
    this.router
      .route("/:id")
      .get(this.controller.getSingleFlightBooking)
      .delete(this.controller.cancelFlightBooking);
  }
}
export default BtobFlightBookingRouter;
