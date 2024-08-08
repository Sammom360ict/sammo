import AbstractRouter from "../../../abstract/abstract.router";
import AdminAuthController from "../controller/auth.admin.controller";

class AdminAuthRouter extends AbstractRouter {
    private AdminAuthController = new AdminAuthController();
    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {
        //login
        this.router
            .route('/login')
            .post(this.AdminAuthController.login)

        //forget password
        this.router
            .route('/forget-password')
            .post(this.AdminAuthController.forgetPassword);
    }


}

export default AdminAuthRouter;