import { Router } from "express";
import { AdminBtoBBookingServiceRouter } from "./routers/admin.b2bBookingService.router";
import { AdminBtocRouter } from "./routers/admin.btoc.router";
import { AdminAgencyRouter } from "./routers/adminAgency.router";
import AdministrationRouter from "./routers/administration.router";
import { AirlineRouter } from "./routers/airline.router";
import { AirlineCommissionRouter } from "./routers/airlineCommision.router";
import { AirportRouter } from "./routers/airport.router";
import AdminArticleRouter from "./routers/article.router";
import AdminB2BFlightBookingRouter from "./routers/b2bFlightBooking.router";
import AdminDashboardRouter from "./routers/dashboard.router";
import adminFlightBookingRouter from "./routers/flightBooking.router";
import AdminProfileRouter from "./routers/profile.router";
import { AdminVisaRouter } from "./routers/visa.router";
import { AdminPromotionalRouter } from "./routers/adminPromotional.router";
import BookingRequestRouter from "../b2c/routers/btocBookingRequest.router";
import { PaymentRouter } from "./routers/adminPayment.router";

class AdminRootRouter {
  public Router = Router();
  private ProfileRouter = new AdminProfileRouter();
  private ArticleRouter = new AdminArticleRouter();
  private AirlinesCommissionRouter = new AirlineCommissionRouter();
  private AirlineRouter = new AirlineRouter();
  private VisaRouter = new AdminVisaRouter();
  private DashBoardRouter = new AdminDashboardRouter();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    //profile
    this.Router.use("/profile", this.ProfileRouter.router);

    //administration
    this.Router.use("/administration", new AdministrationRouter().router);

    //article
    this.Router.use("/article", this.ArticleRouter.router);

    //airline commission
    this.Router.use(
      "/airlines-commission",
      this.AirlinesCommissionRouter.router
    );

    //airline router
    this.Router.use("/airlines", this.AirlineRouter.router);

    //airport router
    this.Router.use("/airport", new AirportRouter().router);

    //payment router
    this.Router.use("/payment", new PaymentRouter().router);

    //visa router
    this.Router.use("/visa", this.VisaRouter.router);

    //dashboard router
    this.Router.use("/dashboard", this.DashBoardRouter.router);

    // btoc router
    this.Router.use("/btoc", new AdminBtocRouter().router);

    //b2c flight booking router
    this.Router.use(
      "/b2c/flight-booking",
      new adminFlightBookingRouter().router
    );

    //b2b flight booking router
    this.Router.use(
      "/b2b/flight-booking",
      new AdminB2BFlightBookingRouter().router
    );

    //agency router
    this.Router.use(
      "/booking-service",
      new AdminBtoBBookingServiceRouter().router
    );

    //promotional router
    this.Router.use("/promotion", new AdminPromotionalRouter().router);

    //agency router
    this.Router.use("/agency", new AdminAgencyRouter().router);
  }
}
export default AdminRootRouter;
