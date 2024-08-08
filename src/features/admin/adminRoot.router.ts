import { Router } from 'express';
import AdminProfileRouter from './routers/profile.router';
import AdministrationRouter from './routers/administration.router';
import AdminArticleRouter from './routers/article.router';
import { AirlineCommissionRouter } from './routers/airlineCommision.router';
import { AirlineRouter } from './routers/airline.router';
import { AirportRouter } from './routers/airport.router';
import { BookingRequestRouter } from './routers/bookingRequest.router';
import { AdminVisaRouter } from './routers/visa.router';
import AdminDashboardRouter from './routers/dashboard.router';
import adminFlightBookingRouter from './routers/flightBooking.router';
import { AdminAgencyRouter } from './routers/adminAgency.router';
import adminB2BFlightBookingRouter from './routers/b2bFlightBooking.router';
class AdminRootRouter {
  public Router = Router();
  private ProfileRouter = new AdminProfileRouter();
  private AdministrationRouter = new AdministrationRouter();
  private ArticleRouter = new AdminArticleRouter();
  private AirlinesCommissionRouter = new AirlineCommissionRouter();
  private AirlineRouter = new AirlineRouter();
  private AirportRouter = new AirportRouter();
  private BookingRequestRouter = new BookingRequestRouter();
  private VisaRouter = new AdminVisaRouter();
  private DashBoardRouter = new AdminDashboardRouter();
  private B2CFlightBookingRouter = new adminFlightBookingRouter();
  private AdminAgencyRouter = new AdminAgencyRouter();
  private B2BBookingRouter = new adminB2BFlightBookingRouter();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    //profile
    this.Router.use('/profile', this.ProfileRouter.router);
    //administration
    this.Router.use('/administration', this.AdministrationRouter.router);
    // //article
    // this.Router.use('/article', this.ArticleRouter.router);
    //airline commission
    this.Router.use('/airlines-commission', this.AirlinesCommissionRouter.router);
    //airline router
    this.Router.use('/airlines', this.AirlineRouter.router);
    //airport router
    this.Router.use('/airport', this.AirportRouter.router);
    // //booking request router
    // this.Router.use('/booking-request', this.BookingRequestRouter.router);
    // //visa router
    this.Router.use('/visa', this.VisaRouter.router);
    //dashboard router
    this.Router.use('/dashboard', this.DashBoardRouter.router);
    //b2c flight booking router
    this.Router.use('/b2c/flight-booking', this.B2CFlightBookingRouter.router);
    //b2b flight booking router
    this.Router.use('/b2b/flight-booking', this.B2BBookingRouter.router);
    //agency router
    this.Router.use('/agency', this.AdminAgencyRouter.router);
  }
}
export default AdminRootRouter;
