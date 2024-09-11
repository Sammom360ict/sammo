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
        // insert promo & get
        this.router
            .route("/promo-code")
            .post(this.controller.insertPromoCode)
            .get(this.controller.getAllPromoCode);
        // update promo code
        this.router.route("/promo-code/:id").patch(this.controller.updatePromoCode);
        // create offer
        this.router
            .route("/offer")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES), this.controller.inserOffer)
            .get(this.controller.getAllOffer);
        // update offer
        this.router
            .route("/offer/:id")
            .get(this.controller.getSingleOffer)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES), this.controller.updateOffer);
    }
}
exports.AdminPromotionalRouter = AdminPromotionalRouter;
