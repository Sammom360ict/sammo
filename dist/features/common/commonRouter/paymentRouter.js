"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const paymentController_1 = __importDefault(require("../commonController/paymentController"));
class PaymentRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new paymentController_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router.route('/failed').post(this.Controller.paymentFailed);
        this.router.route('/success').post(this.Controller.paymentSuccess);
        this.router.route('/cancelled').post(this.Controller.paymentCancelled);
    }
}
exports.default = PaymentRouter;
