"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingProfile_router_1 = __importDefault(require("./routers/bookingProfile.router"));
const authChecker_1 = __importDefault(require("../../middleware/authChecker/authChecker"));
const bookingTraveler_router_1 = __importDefault(require("./routers/bookingTraveler.router"));
const bookingFlight_router_1 = __importDefault(require("./routers/bookingFlight.router"));
const flightBooking_router_1 = __importDefault(require("./routers/flightBooking.router"));
const ticketIssue_router_1 = __importDefault(require("./routers/ticketIssue.router"));
const bookingPayment_router_1 = require("./routers/bookingPayment.router");
const bookingVisa_router_1 = require("./routers/bookingVisa.router");
const btocBookingRequest_router_1 = __importDefault(require("./routers/btocBookingRequest.router"));
class B2CRootRouter {
    constructor() {
        this.Router = (0, express_1.Router)();
        this.TravelerRouter = new bookingTraveler_router_1.default();
        this.ProfileRouter = new bookingProfile_router_1.default();
        this.PaymentRouter = new bookingPayment_router_1.BookingPaymentRouter();
        this.TicketRouter = new ticketIssue_router_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // flight router
        this.Router.use("/flight", this.authChecker.userPublicAuthChecker, new bookingFlight_router_1.default().router);
        // traveler router
        this.Router.use("/traveler", this.authChecker.userAuthChecker, this.TravelerRouter.router);
        //profile
        this.Router.use("/profile", this.authChecker.userAuthChecker, this.ProfileRouter.router);
        //visa application router
        this.Router.use("/visa-application", this.authChecker.userAuthChecker, new bookingVisa_router_1.BookingVisaRouter().router);
        //payment router
        this.Router.use("/payment", this.authChecker.userAuthChecker, this.PaymentRouter.router);
        //flight booking request router
        this.Router.use("/flight-booking-request", this.authChecker.userAuthChecker, new btocBookingRequest_router_1.default().router);
        //flight booking router
        this.Router.use("/flight-booking", this.authChecker.userAuthChecker, new flightBooking_router_1.default().router);
        //ticket router
        this.Router.use("/ticket-issue", this.authChecker.userAuthChecker, this.TicketRouter.router);
    }
}
exports.default = B2CRootRouter;
