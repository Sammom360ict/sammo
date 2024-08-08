"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
class AdminDashboardRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new dashboard_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //dashboard
        this.router.route('/').get(this.controller.get);
    }
}
exports.default = AdminDashboardRouter;
