"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const flightBooking_controller_1 = __importDefault(require("../controllers/flightBooking.controller"));
class flightBookingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new flightBooking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // Get all flight booking
        this.router
            .route("/")
            .post(this.controller.flightBooking)
            .get(this.controller.getAllFlightBooking);
        // Get single flight booking
        this.router
            .route("/:id")
            .get(this.controller.getSingleFlightBooking)
            .delete(this.controller.cancelFlightBooking);
    }
}
exports.default = flightBookingRouter;
