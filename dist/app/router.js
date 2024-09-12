"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commonRouter_1 = __importDefault(require("../features/common/commonRouter/commonRouter"));
const auth_router_1 = __importDefault(require("../features/auth/auth.router"));
const adminRoot_router_1 = __importDefault(require("../features/admin/adminRoot.router"));
const authChecker_1 = __importDefault(require("../middleware/authChecker/authChecker"));
const paymentRouter_1 = __importDefault(require("../features/common/commonRouter/paymentRouter"));
const b2bRoot_router_1 = __importDefault(require("../features/b2b/b2bRoot.router"));
const b2cRoot_router_1 = __importDefault(require("../features/b2c/b2cRoot.router"));
class RootRouter {
    constructor() {
        this.v1Router = (0, express_1.Router)();
        this.authRouter = new auth_router_1.default();
        this.authChecker = new authChecker_1.default();
        this.callV1Router();
    }
    callV1Router() {
        //common
        this.v1Router.use("/common", new commonRouter_1.default().router);
        //payment
        this.v1Router.use("/payment", new paymentRouter_1.default().router);
        //auth
        this.v1Router.use("/auth", this.authRouter.AuthRouter);
        //admin
        this.v1Router.use("/admin", this.authChecker.adminAuthChecker, new adminRoot_router_1.default().Router);
        //b2c
        this.v1Router.use("/btoc", new b2cRoot_router_1.default().Router);
        //b2b
        this.v1Router.use("/btob", this.authChecker.b2bAuthChecker, new b2bRoot_router_1.default().Router);
    }
}
exports.default = RootRouter;
