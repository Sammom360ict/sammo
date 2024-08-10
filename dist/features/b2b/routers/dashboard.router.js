"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2BDashboardRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
class B2BDashboardRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new dashboard_controller_1.B2BDashboardController();
        this.callRouter();
    }
    callRouter() {
        this.router.route('/').get(this.controller.dashboardController);
    }
}
exports.B2BDashboardRouter = B2BDashboardRouter;
