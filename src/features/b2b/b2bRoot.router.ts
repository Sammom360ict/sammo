import { Router } from "express";
import BookingProfileRouter from "./routers/bookingProfile.router";
import BtoBBookingServiceRouter from "./routers/bookingService.router";
import { B2BVisaRouter } from "./routers/bookingVisa.router";
import { BtobRouter } from "./routers/btob.router";
import BtobFlightRouter from "./routers/btobFlight.router";
import BtobFlightBookingRouter from "./routers/btobFlightBooking.router";
import BtobTravelerRouter from "./routers/btobTraveler.router";
import { B2BDashboardRouter } from "./routers/dashboard.router";
import { BtoBSubAgencyRouter } from "./routers/subAgency.router";
import ticketIssueRouter from "./routers/ticketIssue.router";
import { BookingPaymentRouter } from "./routers/bookingPayment.router";

class B2BRootRouter {
  public Router = Router();

  private ProfileRouter = new BookingProfileRouter();
  private TicketRouter = new ticketIssueRouter();
  private SubAgentRouter = new BtoBSubAgencyRouter();
  private dashboardRouter = new B2BDashboardRouter();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // flight router
    this.Router.use("/flight", new BtobFlightRouter().router);

    // traveler router
    this.Router.use("/travelers", new BtobTravelerRouter().router);

    //profile
    this.Router.use("/profile", this.ProfileRouter.router);

    //payment router
    this.Router.use("/payment", new BookingPaymentRouter().router);

    //flight booking router
    this.Router.use("/flight-booking", new BtobFlightBookingRouter().router);

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

    // b2b deposit request
    this.Router.use("/", new BtobRouter().router);
  }
}
export default B2BRootRouter;
