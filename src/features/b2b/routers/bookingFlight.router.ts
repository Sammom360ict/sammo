import BookingFlightController from "../controllers/bookinglight.controller";
import AbstractRouter from "../../../abstract/abstract.router";

export default class BookingFlightRouter extends AbstractRouter {
  private controller = new BookingFlightController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // search flight
    this.router.route("/search").post(this.controller.flightSearch);

    // filter flight
    this.router.route("/filter").get(this.controller.flightFilter);

    // revalidate flight
    this.router.route("/revalidate").post(this.controller.revalidatedFlightV2);
  }
}
