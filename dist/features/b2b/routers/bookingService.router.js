"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const bookingService_controller_1 = __importDefault(require("../controllers/bookingService.controller"));
class BtoBBookingServiceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new bookingService_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.createSupport)
            .get(this.controller.getList);
        // create message, get single, close support
        this.router
            .route("/:id")
            .get(this.controller.getDetails)
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.createMessage);
        // .delete(this.controller.closeSupport);
    }
}
exports.default = BtoBBookingServiceRouter;
