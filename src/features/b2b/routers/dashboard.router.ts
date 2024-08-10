
import AbstractRouter from '../../../abstract/abstract.router';
import { B2BDashboardController } from '../controllers/dashboard.controller';

export class B2BDashboardRouter extends AbstractRouter{
    private controller = new B2BDashboardController();
    constructor(){
        super();
        this.callRouter();
    }

    private callRouter(){
        this.router.route('/').get(this.controller.dashboardController);
    }
}