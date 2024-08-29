import AbstractRouter from "../../../abstract/abstract.router";
import { AdminAgencyController } from "../controllers/adminAgency.controller";

export class AdminAgencyRouter extends AbstractRouter {
  private controller = new AdminAgencyController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // deposit to agency
    this.router.route("/deposit").post(this.controller.depositToAgency);

    // deposit request
    this.router
      .route("/deposit-request")
      .get(this.controller.getAllDepositRequestList);

    //transaction list
    this.router.route("/transaction/:id").get(this.controller.getTransaction);

    // create get
    this.router
      .route("/")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.create
      )
      .get(this.controller.get);

    // create user
    this.router
      .route("/user")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.createUser
      );

    // update user
    this.router
      .route("/user/:id")
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.updateUser
      );

    // update, get single
    this.router
      .route("/:id")
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.update
      )
      .get(this.controller.getSingle);
  }
}
