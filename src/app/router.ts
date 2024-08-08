import { Router } from 'express';
import CommonRouter from '../features/common/commonRouter/commonRouter';
import AuthRouter from '../features/auth/auth.router';
import AdminRootRouter from '../features/admin/adminRoot.router';
import AuthChecker from '../middleware/authChecker/authChecker';
import PaymentRouter from '../features/common/commonRouter/paymentRouter';
import B2BRootRouter from '../features/b2b/b2bRoot.router';
import B2CRootRouter from '../features/b2c/b2cRoot.router';

class RootRouter {
  public v1Router = Router();
  private commonRouter = new CommonRouter();
  private authRouter = new AuthRouter();
  private adminRouter = new AdminRootRouter();
  private authChecker = new AuthChecker();
  private B2CRootRouter = new B2CRootRouter();
  private paymentRouter = new PaymentRouter();
  private B2BRouter = new B2BRootRouter();

  constructor() {
    this.callV1Router();
  }

  private callV1Router() {
    //common
    this.v1Router.use('/common', this.commonRouter.router);
    //payment
    this.v1Router.use('/payment', this.paymentRouter.router);

    //auth
    this.v1Router.use('/auth', this.authRouter.AuthRouter);

    //admin
    this.v1Router.use(
      '/admin',
      this.authChecker.adminAuthChecker,
      this.adminRouter.Router
    );

    //b2c
    this.v1Router.use('/btoc', this.B2CRootRouter.Router);

    //b2b
    this.v1Router.use('/btob', this.authChecker.b2bAuthChecker, this.B2BRouter.Router);
  }
}

export default RootRouter;
