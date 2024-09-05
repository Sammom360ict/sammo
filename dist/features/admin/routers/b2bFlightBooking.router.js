"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const b2bFlightBooking_controller_1 = __importDefault(require("../controllers/b2bFlightBooking.controller"));
class adminB2BFlightBookingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new b2bFlightBooking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // Get all flight booking
        this.router.route("/").get(this.controller.getAllFlightBooking);
        // // ticket booking cancel
        // this.router.route('/cancel').post(this.controller.cancelFlightBooking);
        // ticket issue manual
        this.router
            .route("/issue-manual/:id")
            .post(this.controller.manualIssueTicket);
        // Get single flight booking
        this.router
            .route("/:id")
            .get(this.controller.getSingleFlightBooking)
            .post(this.controller.issueTicket)
            .delete(this.controller.cancelFlightBooking);
    }
}
exports.default = adminB2BFlightBookingRouter;
