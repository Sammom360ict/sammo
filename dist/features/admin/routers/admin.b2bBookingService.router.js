"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBtoBBookingServiceRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const admin_B2bBooking_controller_1 = require("../controllers/admin.B2bBooking.controller");
class AdminBtoBBookingServiceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_B2bBooking_controller_1.AdminBtoBBookingServiceController();
        this.callRouter();
    }
    callRouter() {
        // get
        this.router.route("/").get(this.controller.getList);
        // create message, get single, close support
        this.router
            .route("/:id")
            .get(this.controller.getDetails)
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.createMessage)
            .delete(this.controller.closeSupport);
    }
}
exports.AdminBtoBBookingServiceRouter = AdminBtoBBookingServiceRouter;
