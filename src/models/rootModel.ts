import { Knex } from "knex";
import { db } from "../app/database";
import AdministrationModel from "./adminModel/administrationModel";
import AdminModel from "./adminModel/adminModel";
import { AgencyModel } from "./agencyModel/agencyModel";
import B2BFlightBookingModel from "./agencyModel/b2bFlightBookingModel";
import B2BFlightTicketModel from "./agencyModel/b2bFlightTicketModel";
import ArticleModel from "./articleModel/articleModel";
import { AuditTrailModel } from "./auditTrailModel/auditTrailModel";

import { BtoBBookingServiceModel } from "./bookingServiceModel/BtoBBookingServiceModel";
import { AirlineCommissionModel } from "./commonModel/airlinesCommissionModel";
import CommonModel from "./commonModel/commonModel";
import BtocFlightBookingModel from "./flightModel/btocFlightBookingModel";
import { FlightModel } from "./flightModel/flightModel";
import FlightTicketModel from "./flightModel/flightTicketModel";
import PromotionModel from "./promotionModel/promotionModel";
import PaymentModel from "./userModel/paymentModel";
import TravelerModel from "./userModel/travelerModel";
import UserModel from "./userModel/userModel";
import { VisaModel } from "./visaModel/visaModel";
import { BtocBookingRequestModel } from "./bookingModel/bookingRequestModel";
import { AdminAuditTrailModel } from "./auditTrailModel/adminAuditTrailModel";

class Models {
  //booking request models
  public btocBookingRequestModel(trx?: Knex.Transaction) {
    return new BtocBookingRequestModel(trx || db);
  }
  // common models
  public commonModel(trx?: Knex.Transaction) {
    return new CommonModel(trx || db);
  }
  // admin models
  public adminModel(trx?: Knex.Transaction) {
    return new AdminModel(trx || db);
  }
  //administration model
  public administrationModel(trx?: Knex.Transaction) {
    return new AdministrationModel(trx || db);
  }
  //user model
  public userModel(trx?: Knex.Transaction) {
    return new UserModel(trx || db);
  }
  //traveler model
  public travelerModel(trx?: Knex.Transaction) {
    return new TravelerModel(trx || db);
  }
  //article model
  public articleModel(trx?: Knex.Transaction) {
    return new ArticleModel(trx || db);
  }

  //promotion model
  public promotionModel(trx?: Knex.Transaction) {
    return new PromotionModel(trx || db);
  }
  //airline commission model
  public AirlineCommissionModel(trx?: Knex.Transaction) {
    return new AirlineCommissionModel(trx || db);
  }
  //visa model
  public VisaModel(trx?: Knex.Transaction) {
    return new VisaModel(trx || db);
  }

  //flight model
  public flightModel(trx?: Knex.Transaction) {
    return new FlightModel(trx || db);
  }
  //payment model
  public paymentModel(trx?: Knex.Transaction) {
    return new PaymentModel(trx || db);
  }
  //flight booking model
  public btocFlightBookingModel(trx?: Knex.Transaction) {
    return new BtocFlightBookingModel(trx || db);
  }
  //flight ticket issue model
  public flightTicketIssueModel(trx?: Knex.Transaction) {
    return new FlightTicketModel(trx || db);
  }
  //agency model
  public agencyModel(trx?: Knex.Transaction) {
    return new AgencyModel(trx || db);
  }
  //B2B Flight booking model
  public b2bFlightBookingModel(trx?: Knex.Transaction) {
    return new B2BFlightBookingModel(trx || db);
  }

  //B2B Ticket issue model
  public b2bTicketIssueModel(trx?: Knex.Transaction) {
    return new B2BFlightTicketModel(trx || db);
  }

  //B2B booking support model
  public btobBookingSupportModel(trx?: Knex.Transaction) {
    return new BtoBBookingServiceModel(trx || db);
  }

  //Admin audit model
  public adminAuditTrailModel(trx?: Knex.Transaction) {
    return new AdminAuditTrailModel(trx || db);
  }
  //B2B Ticket issue model
  public auditTrailModel(trx?: Knex.Transaction) {
    return new AuditTrailModel(trx || db);
  }
}
export default Models;
