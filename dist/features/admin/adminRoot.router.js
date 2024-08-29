"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_router_1 = __importDefault(require("./routers/profile.router"));
const administration_router_1 = __importDefault(require("./routers/administration.router"));
const article_router_1 = __importDefault(require("./routers/article.router"));
const airlineCommision_router_1 = require("./routers/airlineCommision.router");
const airline_router_1 = require("./routers/airline.router");
const airport_router_1 = require("./routers/airport.router");
const bookingRequest_router_1 = require("./routers/bookingRequest.router");
const visa_router_1 = require("./routers/visa.router");
const dashboard_router_1 = __importDefault(require("./routers/dashboard.router"));
const flightBooking_router_1 = __importDefault(require("./routers/flightBooking.router"));
const adminAgency_router_1 = require("./routers/adminAgency.router");
const b2bFlightBooking_router_1 = __importDefault(require("./routers/b2bFlightBooking.router"));
class AdminRootRouter {
    constructor() {
        this.Router = (0, express_1.Router)();
        this.ProfileRouter = new profile_router_1.default();
        this.ArticleRouter = new article_router_1.default();
        this.AirlinesCommissionRouter = new airlineCommision_router_1.AirlineCommissionRouter();
        this.AirlineRouter = new airline_router_1.AirlineRouter();
        this.AirportRouter = new airport_router_1.AirportRouter();
        this.BookingRequestRouter = new bookingRequest_router_1.BookingRequestRouter();
        this.VisaRouter = new visa_router_1.AdminVisaRouter();
        this.DashBoardRouter = new dashboard_router_1.default();
        this.callRouter();
    }
    callRouter() {
        //profile
        this.Router.use("/profile", this.ProfileRouter.router);
        //administration
        this.Router.use("/administration", new administration_router_1.default().router);
        //article
        this.Router.use("/article", this.ArticleRouter.router);
        //airline commission
        this.Router.use("/airlines-commission", this.AirlinesCommissionRouter.router);
        //airline router
        this.Router.use("/airlines", this.AirlineRouter.router);
        //airport router
        this.Router.use("/airport", this.AirportRouter.router);
        // //booking request router
        // this.Router.use('/booking-request', this.BookingRequestRouter.router);
        // //visa router
        this.Router.use("/visa", this.VisaRouter.router);
        //dashboard router
        this.Router.use("/dashboard", this.DashBoardRouter.router);
        //b2c flight booking router
        this.Router.use("/b2c/flight-booking", new flightBooking_router_1.default().router);
        //b2b flight booking router
        this.Router.use("/b2b/flight-booking", new b2bFlightBooking_router_1.default().router);
        //agency router
        this.Router.use("/agency", new adminAgency_router_1.AdminAgencyRouter().router);
    }
}
exports.default = AdminRootRouter;
