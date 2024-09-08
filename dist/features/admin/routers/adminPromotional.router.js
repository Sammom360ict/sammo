"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPromotionalRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const adminPromotional_controller_1 = require("../controllers/adminPromotional.controller");
class AdminPromotionalRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new adminPromotional_controller_1.AdminPromotionalController();
        this.callRouter();
    }
    // call router
    callRouter() {
        // deposit to agency
        this.router.route("/promo-codes").post(this.controller.insertPromoCode);
        this.router
            .route("/deposit-request/:id")
            .patch(this.controller.updateDepositRequest);
    }
}
exports.AdminPromotionalRouter = AdminPromotionalRouter;
