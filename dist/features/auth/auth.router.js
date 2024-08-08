"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_admin_router_1 = __importDefault(require("./router/auth.admin.router"));
const auth_user_router_1 = __importDefault(require("./router/auth.user.router"));
const auth_agent_router_1 = __importDefault(require("./router/auth.agent.router"));
class AuthRouter {
    constructor() {
        this.AuthRouter = (0, express_1.Router)();
        this.AdminAuthRouter = new auth_admin_router_1.default();
        this.UserAuthRouter = new auth_user_router_1.default();
        this.AgentAuthRouter = new auth_agent_router_1.default();
        this.callRouter();
    }
    callRouter() {
        // admin auth routers
        this.AuthRouter.use('/admin', this.AdminAuthRouter.router);
        // booking website user auth routers
        this.AuthRouter.use('/user', this.UserAuthRouter.router);
        //agent auth router
        this.AuthRouter.use('/agent', this.AgentAuthRouter.router);
    }
}
exports.default = AuthRouter;
