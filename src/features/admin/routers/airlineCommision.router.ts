import AbstractRouter from '../../../abstract/abstract.router';
import { AirlineCommissionController } from '../controllers/airlineCommission.controller';

export class AirlineCommissionRouter extends AbstractRouter {
  private controller = new AirlineCommissionController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // create and get
    this.router
      .route('/')
      .post(this.controller.create)
      .get(this.controller.get);

    //  update router
    this.router.route('/:code').patch(this.controller.update)
    .delete(this.controller.delete);
  }
}
