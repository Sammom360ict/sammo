"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookinglight_controller_1 = __importDefault(require("../controllers/bookinglight.controller"));
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
class BookingFlightRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new bookinglight_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // search flight
        this.router.route('/search').post(this.controller.flightSearch);
        // filter flight
        this.router.route('/filter').get(this.controller.flightFilter);
        // revalidate flight
        this.router
            .route('/revalidate')
            .post(this.controller.revalidate);
    }
}
exports.default = BookingFlightRouter;
