import AbstractRouter from "../../../abstract/abstract.router";
import adminB2BFlightBookingController from "../controllers/b2bFlightBooking.controller";

class adminB2BFlightBookingRouter extends AbstractRouter {
  private controller = new adminB2BFlightBookingController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Get all flight booking
    this.router.route("/").get(this.controller.getAllFlightBooking);

    // // ticket booking cancel
    // this.router.route('/cancel').post(this.controller.cancelFlightBooking);

    // ticket issue manual
    this.router
      .route("/issue-manual/:id")
      .post(this.controller.manualIssueTicket);

    // Get single flight booking
    this.router
      .route("/:id")
      .get(this.controller.getSingleFlightBooking)
      .post(this.controller.issueTicket)
      .delete(this.controller.cancelFlightBooking);
  }
}
export default adminB2BFlightBookingRouter;
