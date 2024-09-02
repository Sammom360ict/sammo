import AbstractRouter from "../../../abstract/abstract.router";
import { AdminBtoBBookingServiceController } from "../controllers/admin.B2bBooking.controller";

export class AdminBtoBBookingServiceRouter extends AbstractRouter {
  private controller = new AdminBtoBBookingServiceController();
  constructor() {
    super();
    this.callRouter();
  }
  private callRouter() {
    // get
    this.router.route("/").get(this.controller.getList);
    // create message, get single, close support
    this.router
      .route("/:id")
      .get(this.controller.getDetails)
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.createMessage
      )
      .delete(this.controller.closeSupport);
  }
}
