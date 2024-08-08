"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirportRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const airport_controller_1 = require("../controllers/airport.controller");
class AirportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new airport_controller_1.AirportController();
        this.callRouter();
    }
    // call router
    callRouter() {
        //insert airport, get airport
        this.router
            .route('/')
            .post(this.controller.insertAirport);
        //update, delete airport
        this.router
            .route('/:id')
            .patch(this.controller.updateAirport)
            .delete(this.controller.deleteAirport);
    }
}
exports.AirportRouter = AirportRouter;
