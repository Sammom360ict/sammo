"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAgencyValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class AdminAgencyValidator {
    constructor() {
        // create agency schema
        this.createAgencySchema = joi_1.default.object({
            agency_email: joi_1.default.string().email().lowercase().required(),
            agency_phone: joi_1.default.string().min(11).max(14).required(),
            agency_name: joi_1.default.string().required(),
            // commission: Joi.number().min(0).max(12).required(),
            user_name: joi_1.default.string().required(),
            user_email: joi_1.default.string().email().lowercase().required(),
            user_password: joi_1.default.string().required(),
            user_phone: joi_1.default.string().min(11).max(14).required(),
        });
        // update agency schema
        this.updateAgencySchema = joi_1.default.object({
            email: joi_1.default.string().email().lowercase().optional(),
            phone: joi_1.default.string().min(11).max(14).optional(),
            agency_name: joi_1.default.string().optional(),
            commission: joi_1.default.number().min(0).optional(),
            status: joi_1.default.number().valid("true", "false").optional(),
        });
        // create agency user schema
        this.createAgencyUserSchema = joi_1.default.object({
            agency_id: joi_1.default.number().required(),
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().lowercase().required(),
            password: joi_1.default.string().required(),
            mobile_number: joi_1.default.string().min(11).max(14).required(),
        });
        // update agency user schema
        this.updateAgencyUserSchema = joi_1.default.object({
            name: joi_1.default.string().optional(),
            email: joi_1.default.string().email().lowercase().optional(),
            mobile_number: joi_1.default.string().min(11).max(14).optional(),
            status: joi_1.default.number().valid(0, 1).optional(),
        });
        //deposit to agency schema
        this.depositToAgencySchema = joi_1.default.object({
            agency_id: joi_1.default.number().required(),
            type: joi_1.default.string().valid("credit", "debit").required(),
            amount: joi_1.default.number().required(),
            details: joi_1.default.string().optional(),
        });
    }
}
exports.AdminAgencyValidator = AdminAgencyValidator;
