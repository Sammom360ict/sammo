import AbstractRouter from "../../../abstract/abstract.router";
import { BookingVisaController } from "../controllers/bookingVisa.controller";

export class BookingVisaRouter extends AbstractRouter {
  private controller = new BookingVisaController();
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
