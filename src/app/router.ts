import { Router } from "express";
import CommonRouter from "../features/common/commonRouter/commonRouter";
import AuthRouter from "../features/auth/auth.router";
import AdminRootRouter from "../features/admin/adminRoot.router";
import AuthChecker from "../middleware/authChecker/authChecker";
import PaymentRouter from "../features/common/commonRouter/paymentRouter";
import B2BRootRouter from "../features/b2b/b2bRoot.router";
import B2CRootRouter from "../features/b2c/b2cRoot.router";

class RootRouter {
  public v1Router = Router();
  private authRouter = new AuthRouter();
  private authChecker = new AuthChecker();

  constructor() {
    this.callV1Router();
  }

  private callV1Router() {
    //common
    this.v1Router.use("/common", new CommonRouter().router);

    //payment
    this.v1Router.use("/payment", new PaymentRouter().router);

    //auth
    this.v1Router.use("/auth", this.authRouter.AuthRouter);

    //admin
    this.v1Router.use(
      "/admin",
      this.authChecker.adminAuthChecker,
      new AdminRootRouter().Router
    );

    //b2c
    this.v1Router.use("/btoc", new B2CRootRouter().Router);

    //b2b
    this.v1Router.use(
      "/btob",
      this.authChecker.b2bAuthChecker,
      new B2BRootRouter().Router
    );
  }
}

export default RootRouter;
