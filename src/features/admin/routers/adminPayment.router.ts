import AbstractRouter from "../../../abstract/abstract.router";
import { PaymentController } from "../controllers/adminPayment.controller";

export class PaymentRouter extends AbstractRouter {
  private controller = new PaymentController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    //insert airport, get airport
    this.router
      .route("/load-credit")
      .post(this.controller.insertAgencyCredit)
      .get(this.controller.getAllAirport);

    //update, delete airport
    this.router
      .route("/:id")
      .patch(this.controller.updateAirport)
      .delete(this.controller.deleteAirport);
  }
}
