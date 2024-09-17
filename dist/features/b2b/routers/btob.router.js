"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtobRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const btob_controller_1 = require("../controllers/btob.controller");
class BtobRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new btob_controller_1.BtobController();
        this.callRouter();
    }
    callRouter() {
        //insert deposit request, list
        this.router
            .route("/deposit-request")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.insertDeposit)
            .get(this.controller.getAllDepositRequestList);
        //single application
        this.router
            .route("/deposit-request/:id")
            .get(this.controller.getSingleApplication);
    }
}
exports.BtobRouter = BtobRouter;
