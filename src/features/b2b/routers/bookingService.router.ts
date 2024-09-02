import AbstractRouter from "../../../abstract/abstract.router";
import BtoBBookingServiceController from "../controllers/bookingService.controller";

class BtoBBookingServiceRouter extends AbstractRouter {
  private controller = new BtoBBookingServiceController();
  constructor() {
    super();
    this.callRouter();
  }
  private callRouter() {
    // create and get
    this.router
      .route("/")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.createSupport
      )
      .get(this.controller.getList);
    // create message, get single, close support
    this.router
      .route("/:id")
      .get(this.controller.getDetails)
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.createMessage
      );
    // .delete(this.controller.closeSupport);
  }
}

export default BtoBBookingServiceRouter;
