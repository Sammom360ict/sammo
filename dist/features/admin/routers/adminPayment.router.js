"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const adminPayment_controller_1 = require("../controllers/adminPayment.controller");
class PaymentRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new adminPayment_controller_1.PaymentController();
        this.callRouter();
    }
    // call router
    callRouter() {
        //insert airport, get airport
        this.router
            .route("/load-credit")
            .post(this.controller.insertAgencyCredit)
            .get(this.controller.getAllAirport);
        //update, delete airport
        this.router
            .route("/:id")
            .patch(this.controller.updateAirport)
            .delete(this.controller.deleteAirport);
    }
}
exports.PaymentRouter = PaymentRouter;
