"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRequestRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const bookingRequest_controller_1 = require("../controllers/bookingRequest.controller");
class BookingRequestRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new bookingRequest_controller_1.BookingRequestController();
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
exports.BookingRequestRouter = BookingRequestRouter;
