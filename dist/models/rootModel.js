"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../app/database");
const administrationModel_1 = __importDefault(require("./adminModel/administrationModel"));
const adminModel_1 = __importDefault(require("./adminModel/adminModel"));
const agencyModel_1 = require("./agencyModel/agencyModel");
const b2bFlightBookingModel_1 = __importDefault(require("./agencyModel/b2bFlightBookingModel"));
const b2bFlightTicketModel_1 = __importDefault(require("./agencyModel/b2bFlightTicketModel"));
const articleModel_1 = __importDefault(require("./articleModel/articleModel"));
const auditTrailModel_1 = require("./auditTrailModel/auditTrailModel");
const BtoBBookingServiceModel_1 = require("./bookingServiceModel/BtoBBookingServiceModel");
const airlinesCommissionModel_1 = require("./commonModel/airlinesCommissionModel");
const commonModel_1 = __importDefault(require("./commonModel/commonModel"));
const btocFlightBookingModel_1 = __importDefault(require("./flightModel/btocFlightBookingModel"));
const flightModel_1 = require("./flightModel/flightModel");
const flightTicketModel_1 = __importDefault(require("./flightModel/flightTicketModel"));
const promotionModel_1 = __importDefault(require("./promotionModel/promotionModel"));
const paymentModel_1 = __importDefault(require("./userModel/paymentModel"));
const travelerModel_1 = __importDefault(require("./userModel/travelerModel"));
const userModel_1 = __importDefault(require("./userModel/userModel"));
const visaModel_1 = require("./visaModel/visaModel");
const bookingRequestModel_1 = require("./bookingModel/bookingRequestModel");
const adminAuditTrailModel_1 = require("./auditTrailModel/adminAuditTrailModel");
class Models {
    //booking request models
    btocBookingRequestModel(trx) {
        return new bookingRequestModel_1.BtocBookingRequestModel(trx || database_1.db);
    }
    // common models
    commonModel(trx) {
        return new commonModel_1.default(trx || database_1.db);
    }
    // admin models
    adminModel(trx) {
        return new adminModel_1.default(trx || database_1.db);
    }
    //administration model
    administrationModel(trx) {
        return new administrationModel_1.default(trx || database_1.db);
    }
    //user model
    userModel(trx) {
        return new userModel_1.default(trx || database_1.db);
    }
    //traveler model
    travelerModel(trx) {
        return new travelerModel_1.default(trx || database_1.db);
    }
    //article model
    articleModel(trx) {
        return new articleModel_1.default(trx || database_1.db);
    }
    //promotion model
    promotionModel(trx) {
        return new promotionModel_1.default(trx || database_1.db);
    }
    //airline commission model
    AirlineCommissionModel(trx) {
        return new airlinesCommissionModel_1.AirlineCommissionModel(trx || database_1.db);
    }
    //visa model
    VisaModel(trx) {
        return new visaModel_1.VisaModel(trx || database_1.db);
    }
    //flight model
    flightModel(trx) {
        return new flightModel_1.FlightModel(trx || database_1.db);
    }
    //payment model
    paymentModel(trx) {
        return new paymentModel_1.default(trx || database_1.db);
    }
    //flight booking model
    btocFlightBookingModel(trx) {
        return new btocFlightBookingModel_1.default(trx || database_1.db);
    }
    //flight ticket issue model
    flightTicketIssueModel(trx) {
        return new flightTicketModel_1.default(trx || database_1.db);
    }
    //agency model
    agencyModel(trx) {
        return new agencyModel_1.AgencyModel(trx || database_1.db);
    }
    //B2B Flight booking model
    b2bFlightBookingModel(trx) {
        return new b2bFlightBookingModel_1.default(trx || database_1.db);
    }
    //B2B Ticket issue model
    b2bTicketIssueModel(trx) {
        return new b2bFlightTicketModel_1.default(trx || database_1.db);
    }
    //B2B booking support model
    btobBookingSupportModel(trx) {
        return new BtoBBookingServiceModel_1.BtoBBookingServiceModel(trx || database_1.db);
    }
    //Admin audit model
    adminAuditTrailModel(trx) {
        return new adminAuditTrailModel_1.AdminAuditTrailModel(trx || database_1.db);
    }
    //B2B Ticket issue model
    auditTrailModel(trx) {
        return new auditTrailModel_1.AuditTrailModel(trx || database_1.db);
    }
}
exports.default = Models;
