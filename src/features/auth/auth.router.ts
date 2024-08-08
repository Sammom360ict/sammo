import { Router } from 'express';
import AdminAuthRouter from './router/auth.admin.router';
import UserAuthRouter from './router/auth.user.router';
import AgentAuthRouter from './router/auth.agent.router';

class AuthRouter {
  public AuthRouter = Router();
  private AdminAuthRouter = new AdminAuthRouter();
  private UserAuthRouter = new UserAuthRouter();
  private AgentAuthRouter = new AgentAuthRouter();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // admin auth routers
    this.AuthRouter.use('/admin', this.AdminAuthRouter.router);

    // booking website user auth routers
    this.AuthRouter.use('/user', this.UserAuthRouter.router);

    //agent auth router
    this.AuthRouter.use('/agent', this.AgentAuthRouter.router);
  }
}

export default AuthRouter;
