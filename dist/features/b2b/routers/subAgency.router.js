"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtoBSubAgencyRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const subAgency_controller_1 = require("../controllers/subAgency.controller");
class BtoBSubAgencyRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new subAgency_controller_1.BtoBSubAgencyController();
        this.callRouter();
    }
    // call router
    callRouter() {
        // create get
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.create)
            .get(this.controller.get);
        // update, get single
        this.router.route("/:id").get(this.controller.getSingle);
    }
}
exports.BtoBSubAgencyRouter = BtoBSubAgencyRouter;
