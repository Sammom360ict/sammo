"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingProfile_router_1 = __importDefault(require("./routers/bookingProfile.router"));
const bookingService_router_1 = __importDefault(require("./routers/bookingService.router"));
const bookingVisa_router_1 = require("./routers/bookingVisa.router");
const btob_router_1 = require("./routers/btob.router");
const btobFlight_router_1 = __importDefault(require("./routers/btobFlight.router"));
const btobFlightBooking_router_1 = __importDefault(require("./routers/btobFlightBooking.router"));
const btobTraveler_router_1 = __importDefault(require("./routers/btobTraveler.router"));
const dashboard_router_1 = require("./routers/dashboard.router");
const subAgency_router_1 = require("./routers/subAgency.router");
const ticketIssue_router_1 = __importDefault(require("./routers/ticketIssue.router"));
class B2BRootRouter {
    constructor() {
        this.Router = (0, express_1.Router)();
        this.ProfileRouter = new bookingProfile_router_1.default();
        this.TicketRouter = new ticketIssue_router_1.default();
        this.SubAgentRouter = new subAgency_router_1.BtoBSubAgencyRouter();
        this.dashboardRouter = new dashboard_router_1.B2BDashboardRouter();
        this.callRouter();
    }
    callRouter() {
        // flight router
        this.Router.use("/flight", new btobFlight_router_1.default().router);
        // traveler router
        this.Router.use("/travelers", new btobTraveler_router_1.default().router);
        //profile
        this.Router.use("/profile", this.ProfileRouter.router);
        //payment router
        // this.Router.use("/payment", new BookingPaymentRouter().router);
        //flight booking router
        this.Router.use("/flight-booking", new btobFlightBooking_router_1.default().router);
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
        // b2b deposit request
        this.Router.use("/deposit-request", new btob_router_1.BtobRouter().router);
    }
}
exports.default = B2BRootRouter;
