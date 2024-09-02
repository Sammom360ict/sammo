import AbstractRouter from "../../../abstract/abstract.router";
import { AirportController } from "../controllers/airport.controller";

export class AirportRouter extends AbstractRouter {
  private controller = new AirportController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    //insert airport, get airport
    this.router
      .route("/")
      .post(this.controller.insertAirport)
      .get(this.controller.getAllAirport);

    //update, delete airport
    this.router
      .route("/:id")
      .patch(this.controller.updateAirport)
      .delete(this.controller.deleteAirport);
  }
}
