"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBtocRouter = void 0;
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const admin_btoc_controller_1 = require("../controllers/admin.btoc.controller");
class AdminBtocRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_btoc_controller_1.AdminBtocController();
        this.callRouter();
    }
    callRouter() {
        //get users
        this.router.route("/users").get(this.controller.getUsers);
        //get user single
        this.router
            .route("/users/:id")
            .get(this.controller.getSingleUser)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.USER_FILES), this.controller.editUserProfile);
    }
}
exports.AdminBtocRouter = AdminBtocRouter;
