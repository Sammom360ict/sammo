"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminBtocValidator {
    constructor() {
        //get all admin query validator
        this.getAllAdminQueryValidator = joi_1.default.object({
            filter: joi_1.default.string(),
            role: joi_1.default.number(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
            status: joi_1.default.string(),
        });
        //get users filter validator
        this.getUsersFilterValidator = joi_1.default.object({
            filter: joi_1.default.string(),
            status: joi_1.default.boolean(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
        });
        //update user profile
        this.editUserProfileValidator = joi_1.default.object({
            username: joi_1.default.string().min(1).max(255),
            first_name: joi_1.default.string().min(1).max(255),
            last_name: joi_1.default.string().min(1).max(255),
            gender: joi_1.default.string().valid("Male", "Female", "Other"),
            status: joi_1.default.boolean(),
        });
    }
}
exports.default = AdminBtocValidator;
