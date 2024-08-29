"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookingTraveler_controller_1 = __importDefault(require("../controllers/bookingTraveler.controller"));
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
class BookingTravelerRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new bookingTraveler_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get router
        this.router
            .route("/")
            .post(
        // this.uploader.cloudUploadRaw(this.fileFolders.TRAVELER_FILES),
        this.controller.create)
            .get(this.controller.get);
        // get single and update
        this.router
            .route("/:id")
            .get(this.controller.getSingle)
            .patch(
        // this.uploader.cloudUploadRaw(this.fileFolders.TRAVELER_FILES),
        this.controller.update)
            .delete(this.controller.delete);
    }
}
exports.default = BookingTravelerRouter;
