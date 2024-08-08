import AbstractRouter from '../../../abstract/abstract.router';
import PaymentController from '../commonController/paymentController';
class PaymentRouter extends AbstractRouter {
  private Controller = new PaymentController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.router.route('/failed').post(this.Controller.paymentFailed);
    this.router.route('/success').post(this.Controller.paymentSuccess);
    this.router.route('/cancelled').post(this.Controller.paymentCancelled);
  }
}

export default PaymentRouter;
