import AbstractRouter from "../../../abstract/abstract.router";
import AdminAuthController from "../controller/auth.admin.controller";
import UserAuthController from "../controller/auth.user.controller";

class UserAuthRouter extends AbstractRouter {
    private UserAuthController = new UserAuthController();
    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {
        //register
        this.router
        .route('/registration')
        .post(this.uploader.cloudUploadRaw(this.fileFolders.USER_FILES),
        this.UserAuthController.registration)

        //login
        this.router
            .route('/login')
            .post(this.UserAuthController.login)

        //forget password
        this.router
            .route('/forget-password')
            .post(this.UserAuthController.forgetPassword);
    }


}

export default UserAuthRouter;