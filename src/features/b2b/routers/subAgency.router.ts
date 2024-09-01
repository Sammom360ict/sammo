import AbstractRouter from "../../../abstract/abstract.router";
import { BtoBSubAgencyController } from "../controllers/subAgency.controller";

export class BtoBSubAgencyRouter extends AbstractRouter {
  private controller = new BtoBSubAgencyController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // create get
    this.router
      .route("/")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.create
      )
      .get(this.controller.get);

    // update, get single
    this.router.route("/:id").get(this.controller.getSingle);
  }
}
