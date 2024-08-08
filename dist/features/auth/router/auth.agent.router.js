"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const authChecker_1 = __importDefault(require("../../../middleware/authChecker/authChecker"));
const auth_agent_controller_1 = __importDefault(require("../controller/auth.agent.controller"));
class AgentAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.AgentAuthController = new auth_agent_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        //login
        this.router
            .route('/login')
            .post(this.AgentAuthController.login);
        //forget password
        this.router
            .route('/forget-password')
            .post(this.AgentAuthController.forgetPassword);
    }
}
exports.default = AgentAuthRouter;
