"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminVisaRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const visa_controller_1 = require("../controllers/visa.controller");
class AdminVisaRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new visa_controller_1.AdminVisaController();
        this.callRouter();
    }
    callRouter() {
        //get b2c applications
        this.router.route('/btoc/application')
            .get(this.controller.getB2CApplications);
        //single b2c application, update
        this.router.route('/btoc/application/:id')
            .get(this.controller.getB2CSingleApplication)
            .post(this.controller.createB2CTrackingOfApplication);
        //get b2b applications
        this.router.route('/btob/application')
            .get(this.controller.getB2BApplications);
        //single b2b application, update
        this.router.route('/btob/application/:id')
            .get(this.controller.getB2BSingleApplication)
            .post(this.controller.createB2BTrackingOfApplication);
        //create visa, get list
        this.router.route('/')
            .post(this.controller.createVisa)
            .get(this.controller.getVisa);
        //get single visa, update visa
        this.router.route('/:id')
            .get(this.controller.getSingleVisa)
            .patch(this.controller.updateVisa);
    }
}
exports.AdminVisaRouter = AdminVisaRouter;
