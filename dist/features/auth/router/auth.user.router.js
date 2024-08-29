"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const auth_user_controller_1 = __importDefault(require("../controller/auth.user.controller"));
class UserAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.UserAuthController = new auth_user_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //register
        this.router
            .route("/registration")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.USER_FILES), this.UserAuthController.registration);
        //login
        this.router.route("/login").post(this.UserAuthController.login);
        //forget password
        this.router
            .route("/forget-password")
            .post(this.UserAuthController.forgetPassword);
    }
}
exports.default = UserAuthRouter;
