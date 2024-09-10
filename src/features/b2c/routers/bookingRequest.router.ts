import AbstractRouter from "../../../abstract/abstract.router";
import BookingRequestController from "../controllers/bookingRequest.controller";

class BookingRequestRouter extends AbstractRouter {
  private controller = new BookingRequestController();
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
    this.router.route("/:id").get(this.controller.getSingleFlightBooking);
  }
}
export default BookingRequestRouter;
