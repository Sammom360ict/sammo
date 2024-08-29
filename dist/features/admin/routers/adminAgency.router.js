"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAgencyRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const adminAgency_controller_1 = require("../controllers/adminAgency.controller");
class AdminAgencyRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new adminAgency_controller_1.AdminAgencyController();
        this.callRouter();
    }
    // call router
    callRouter() {
        // deposit to agency
        this.router.route("/deposit").post(this.controller.depositToAgency);
        // deposit request
        this.router
            .route("/deposit-request")
            .get(this.controller.getAllDepositRequestList);
        //transaction list
        this.router.route("/transaction/:id").get(this.controller.getTransaction);
        // create get
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.create)
            .get(this.controller.get);
        // create user
        this.router
            .route("/user")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.createUser);
        // update user
        this.router
            .route("/user/:id")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.updateUser);
        // update, get single
        this.router
            .route("/:id")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER), this.controller.update)
            .get(this.controller.getSingle);
    }
}
exports.AdminAgencyRouter = AdminAgencyRouter;
