import AbstractRouter from "../../../abstract/abstract.router";
import { AdminPromotionalController } from "../controllers/adminPromotional.controller";

export class AdminPromotionalRouter extends AbstractRouter {
  private controller = new AdminPromotionalController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // deposit to agency
    this.router.route("/promo-codes").post(this.controller.insertPromoCode);

    this.router
      .route("/deposit-request/:id")
      .patch(this.controller.updateDepositRequest);
  }
}
