import BookingTravelerRouter from "./routers/bookingTraveler.router";
import BookingFlightRouter from "./routers/bookingFlight.router";
import { Router } from "express";
import BookingProfileRouter from "./routers/bookingProfile.router";
import { BookingPaymentRouter } from "./routers/bookingPayment.router";
import flightBookingRouter from "./routers/flightBooking.router";
import ticketIssueRouter from "./routers/ticketIssue.router";
import { BtoBSubAgencyRouter } from "./routers/subAgency.router";
import { B2BVisaRouter } from "./routers/bookingVisa.router";
import { B2BDashboardRouter } from "./routers/dashboard.router";
import { BtobRouter } from "./routers/btob.router";
import BtoBBookingServiceRouter from "./routers/bookingService.router";

class B2BRootRouter {
  public Router = Router();

  private TravelerRouter = new BookingTravelerRouter();
  private ProfileRouter = new BookingProfileRouter();
  private TicketRouter = new ticketIssueRouter();
  private SubAgentRouter = new BtoBSubAgencyRouter();
  private dashboardRouter = new B2BDashboardRouter();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // flight router
    this.Router.use("/flight", new BookingFlightRouter().router);

    // traveler router
    this.Router.use("/travelers", this.TravelerRouter.router);

    //profile
    this.Router.use("/profile", this.ProfileRouter.router);

    //payment router
    // this.Router.use("/payment", new BookingPaymentRouter().router);

    //flight booking router
    this.Router.use("/flight-booking", new flightBookingRouter().router);

    //ticket router
    this.Router.use("/ticket-issue", this.TicketRouter.router);

    //sub agent
    this.Router.use("/sub-agent", this.SubAgentRouter.router);

    //visa router
    this.Router.use("/visa-application", new B2BVisaRouter().router);

    //dashboard router
    this.Router.use("/dashboard", this.dashboardRouter.router);

    //booking service
    this.Router.use("/booking-service", new BtoBBookingServiceRouter().router);

    // b2b request
    this.Router.use("/", new BtobRouter().router);
  }
}
export default B2BRootRouter;
