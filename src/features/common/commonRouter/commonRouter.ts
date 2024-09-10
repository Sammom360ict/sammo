import AbstractRouter from "../../../abstract/abstract.router";
import CommonController from "../commonController/commonController";
class CommonRouter extends AbstractRouter {
  private Controller = new CommonController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // data migrate router
    this.router.post("/migrate-data", this.Controller.dataMigrate);

    // send email otp router
    this.router.post("/send-email-otp", this.Controller.sendEmailOtpController);

    //match otp email
    this.router.post(
      "/match-email-otp",
      this.Controller.matchEmailOtpController
    );

    //get country
    this.router.get("/country", this.Controller.getAllCountry);

    //get city
    this.router.get("/city", this.Controller.getAllCity);

    //get airport
    this.router.route("/airport").get(this.Controller.getAllAirport);

    //get airlines
    this.router.route("/airlines").get(this.Controller.getAllAirlines);

    //get all visa list
    this.router
      .route("/visa-country")
      .get(this.Controller.getAllVisaCountryList);

    //get all visa list
    this.router.route("/visa").get(this.Controller.getAllVisaList);

    //get single visa
    this.router.route("/visa/:id").get(this.Controller.getSingleVisa);

    // get all article
    this.router.route("/article").get(this.Controller.getArticleList);

    // get single article
    this.router.route("/article/:id").get(this.Controller.getSingleArticle);
  }
}

export default CommonRouter;
