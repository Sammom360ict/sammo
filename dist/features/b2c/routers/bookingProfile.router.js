"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const bookingProfile_controller_1 = __importDefault(require("../controllers/bookingProfile.controller"));
class BookingProfileRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.ProfileController = new bookingProfile_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //view profile, edit profile
        this.router
            .route('/')
            .get(this.ProfileController.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.USER_FILES), this.ProfileController.editProfile);
        //change password
        this.router
            .route('/change-password')
            .post(this.ProfileController.changePassword);
    }
}
exports.default = BookingProfileRouter;
