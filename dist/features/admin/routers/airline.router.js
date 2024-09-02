"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlineRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const airline_controller_1 = require("../controllers/airline.controller");
class AirlineRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new airline_controller_1.AirlineController();
        this.callRouter();
    }
    // call router
    callRouter() {
        //insert airlines, get airlines
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.COMMON_FILES), this.controller.insertAirlines);
        //update, delete airlines
        this.router
            .route("/:id")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.COMMON_FILES), this.controller.updateAirlines)
            .delete(this.controller.deleteAirlines);
    }
}
exports.AirlineRouter = AirlineRouter;
