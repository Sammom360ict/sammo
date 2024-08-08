import AbstractRouter from "../../../abstract/abstract.router";
import AuthChecker from "../../../middleware/authChecker/authChecker";
import AgentAuthController from "../controller/auth.agent.controller";

class AgentAuthRouter extends AbstractRouter {
    private AgentAuthController = new AgentAuthController();
    private authChecker = new AuthChecker();
    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {
        //login
        this.router
            .route('/login')
            .post(this.AgentAuthController.login)

        //forget password
        this.router
            .route('/forget-password')
            .post(this.AgentAuthController.forgetPassword);


    }


}

export default AgentAuthRouter;