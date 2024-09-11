import { Router } from "express";
import BookingProfileRouter from "./routers/bookingProfile.router";
import AuthChecker from "../../middleware/authChecker/authChecker";
import BookingTravelerRouter from "./routers/bookingTraveler.router";
import BookingFlightRouter from "./routers/bookingFlight.router";
import flightBookingRouter from "./routers/flightBooking.router";
import ticketIssueRouter from "./routers/ticketIssue.router";
import { BookingPaymentRouter } from "./routers/bookingPayment.router";
import { BookingVisaRouter } from "./routers/bookingVisa.router";
import BookingRequestRouter from "./routers/bookingRequest.router";

class B2CRootRouter {
  public Router = Router();

  private TravelerRouter = new BookingTravelerRouter();
  private ProfileRouter = new BookingProfileRouter();
  private PaymentRouter = new BookingPaymentRouter();
  private TicketRouter = new ticketIssueRouter();
  private authChecker = new AuthChecker();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // flight router
    this.Router.use(
      "/flight",
      this.authChecker.userPublicAuthChecker,
      new BookingFlightRouter().router
    );

    // traveler router
    this.Router.use(
      "/traveler",
      this.authChecker.userAuthChecker,
      this.TravelerRouter.router
    );

    //profile
    this.Router.use(
      "/profile",
      this.authChecker.userAuthChecker,
      this.ProfileRouter.router
    );

    //visa application router
    this.Router.use(
      "/visa-application",
      this.authChecker.userAuthChecker,
      new BookingVisaRouter().router
    );

    //payment router
    this.Router.use(
      "/payment",
      this.authChecker.userAuthChecker,
      this.PaymentRouter.router
    );

    //flight booking request router
    this.Router.use(
      "/flight-booking-request",
      this.authChecker.userAuthChecker,
      new BookingRequestRouter().router
    );

    //flight booking router
    this.Router.use(
      "/flight-booking",
      this.authChecker.userAuthChecker,
      new flightBookingRouter().router
    );

    //ticket router
    this.Router.use(
      "/ticket-issue",
      this.authChecker.userAuthChecker,
      this.TicketRouter.router
    );
  }
}
export default B2CRootRouter;
