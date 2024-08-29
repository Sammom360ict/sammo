import AbstractRouter from "../../../abstract/abstract.router";
import { B2BVisaController } from "../controllers/bookingVisa.controller";

export class B2BVisaRouter extends AbstractRouter {
  private controller = new B2BVisaController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //create application, list
    this.router
      .route("/")
      .post(this.controller.createApplication)
      .get(this.controller.getApplicationList);

    //single application
    this.router.route("/:id").get(this.controller.getSingleApplication);
  }
}
