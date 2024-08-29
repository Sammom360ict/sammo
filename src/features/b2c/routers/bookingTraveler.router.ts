import BookingTravelerController from "../controllers/bookingTraveler.controller";
import AbstractRouter from "../../../abstract/abstract.router";

export default class BookingTravelerRouter extends AbstractRouter {
  private controller = new BookingTravelerController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // create and get router
    this.router
      .route("/")
      .post(
        // this.uploader.cloudUploadRaw(this.fileFolders.TRAVELER_FILES),
        this.controller.create
      )
      .get(this.controller.get);

    // get single and update
    this.router
      .route("/:id")
      .get(this.controller.getSingle)
      .patch(
        // this.uploader.cloudUploadRaw(this.fileFolders.TRAVELER_FILES),
        this.controller.update
      )
      .delete(this.controller.delete);
  }
}
