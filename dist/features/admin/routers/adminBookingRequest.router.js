"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBookingRequestRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const adminBookingRequest_controller_1 = require("../controllers/adminBookingRequest.controller");
class AdminBookingRequestRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new adminBookingRequest_controller_1.AdminBookingRequestController();
        this.callRouter();
    }
    callRouter() {
        // get list
        this.router.route("/").get(this.controller.get);
        // get single
        this.router
            .route("/:id")
            .get(this.controller.getSingle)
            .patch(this.controller.update);
    }
}
exports.AdminBookingRequestRouter = AdminBookingRequestRouter;
