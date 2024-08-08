"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlineCommissionRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const airlineCommission_controller_1 = require("../controllers/airlineCommission.controller");
class AirlineCommissionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new airlineCommission_controller_1.AirlineCommissionController();
        this.callRouter();
    }
    // call router
    callRouter() {
        // create and get
        this.router
            .route('/')
            .post(this.controller.create)
            .get(this.controller.get);
        //  update router
        this.router.route('/:code').patch(this.controller.update)
            .delete(this.controller.delete);
    }
}
exports.AirlineCommissionRouter = AirlineCommissionRouter;
