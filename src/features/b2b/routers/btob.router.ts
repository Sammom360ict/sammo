import AbstractRouter from "../../../abstract/abstract.router";
import { BtobController } from "../controllers/btob.controller";

export class BtobRouter extends AbstractRouter {
  private controller = new BtobController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //insert deposit request, list
    this.router
      .route("/deposit-request")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.controller.insertDeposit
      )
      .get(this.controller.getAllDepositRequestList);

    //single application
    this.router
      .route("/deposit-request/:id")
      .get(this.controller.getSingleApplication);
  }
}
