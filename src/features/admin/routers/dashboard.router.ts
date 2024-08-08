import AbstractRouter from '../../../abstract/abstract.router';
import AdminDashboardController from '../controllers/dashboard.controller';

class AdminDashboardRouter extends AbstractRouter {
  private controller = new AdminDashboardController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //dashboard
    this.router.route('/').get(this.controller.get);
  }
}

export default AdminDashboardRouter;
