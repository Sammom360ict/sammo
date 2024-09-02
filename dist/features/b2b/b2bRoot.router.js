"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookingTraveler_router_1 = __importDefault(require("./routers/bookingTraveler.router"));
const bookingFlight_router_1 = __importDefault(require("./routers/bookingFlight.router"));
const express_1 = require("express");
const bookingProfile_router_1 = __importDefault(require("./routers/bookingProfile.router"));
const flightBooking_router_1 = __importDefault(require("./routers/flightBooking.router"));
const ticketIssue_router_1 = __importDefault(require("./routers/ticketIssue.router"));
const subAgency_router_1 = require("./routers/subAgency.router");
const bookingVisa_router_1 = require("./routers/bookingVisa.router");
const dashboard_router_1 = require("./routers/dashboard.router");
const btob_router_1 = require("./routers/btob.router");
const bookingService_router_1 = __importDefault(require("./routers/bookingService.router"));
class B2BRootRouter {
    constructor() {
        this.Router = (0, express_1.Router)();
        this.TravelerRouter = new bookingTraveler_router_1.default();
        this.ProfileRouter = new bookingProfile_router_1.default();
        this.TicketRouter = new ticketIssue_router_1.default();
        this.SubAgentRouter = new subAgency_router_1.BtoBSubAgencyRouter();
        this.dashboardRouter = new dashboard_router_1.B2BDashboardRouter();
        this.callRouter();
    }
    callRouter() {
        // flight router
        this.Router.use("/flight", new bookingFlight_router_1.default().router);
        // traveler router
        this.Router.use("/travelers", this.TravelerRouter.router);
        //profile
        this.Router.use("/profile", this.ProfileRouter.router);
        //payment router
        // this.Router.use("/payment", new BookingPaymentRouter().router);
        //flight booking router
        this.Router.use("/flight-booking", new flightBooking_router_1.default().router);
        //ticket router
        this.Router.use("/ticket-issue", this.TicketRouter.router);
        //sub agent
        this.Router.use("/sub-agent", this.SubAgentRouter.router);
        //visa router
        this.Router.use("/visa-application", new bookingVisa_router_1.B2BVisaRouter().router);
        //dashboard router
        this.Router.use("/dashboard", this.dashboardRouter.router);
        //booking service
        this.Router.use("/booking-service", new bookingService_router_1.default().router);
        // b2b request
        this.Router.use("/", new btob_router_1.BtobRouter().router);
    }
}
exports.default = B2BRootRouter;
