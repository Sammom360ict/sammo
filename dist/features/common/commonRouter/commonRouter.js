"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const commonController_1 = __importDefault(require("../commonController/commonController"));
class CommonRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new commonController_1.default();
        this.callRouter();
    }
    callRouter() {
        // data migrate router
        this.router.post('/migrate-data', this.Controller.dataMigrate);
        // send email otp router
        this.router.post('/send-email-otp', this.Controller.sendEmailOtpController);
        //match otp email
        this.router.post('/match-email-otp', this.Controller.matchEmailOtpController);
        //get country
        this.router.get('/country', this.Controller.getAllCountry);
        //get city
        this.router.get('/city', this.Controller.getAllCity);
        //get airport
        this.router
            .route('/airport')
            .get(this.Controller.getAllAirport);
        //get airlines
        this.router
            .route('/airlines')
            .get(this.Controller.getAllAirlines);
        //get all visa list
        this.router.route('/visa')
            .get(this.Controller.getAllVisaList);
        //get single visa
        this.router.route('/visa/:id')
            .get(this.Controller.getSingleVisa);
    }
}
exports.default = CommonRouter;
