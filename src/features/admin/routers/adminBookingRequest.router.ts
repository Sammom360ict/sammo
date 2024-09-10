import AbstractRouter from "../../../abstract/abstract.router";
import { AdminBookingRequestController } from "../controllers/adminBookingRequest.controller";

export class AdminBookingRequestRouter extends AbstractRouter {
  private controller = new AdminBookingRequestController();
  constructor() {
    super();
    this.callRouter();
  }
  private callRouter() {
    // get list
    this.router.route("/").get(this.controller.get);
    // get single
    this.router
      .route("/:id")
      .get(this.controller.getSingle)
      .patch(this.controller.update);
  }
}
