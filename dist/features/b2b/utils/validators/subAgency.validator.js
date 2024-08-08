"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtoBSubAgencyValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class BtoBSubAgencyValidator {
    constructor() {
        //create schema
        this.createSchema = joi_1.default.object({
            agency_name: joi_1.default.string().required(),
            agency_email: joi_1.default.string().email().lowercase().required(),
            agency_phone: joi_1.default.string().max(20).optional(),
            commission: joi_1.default.number().optional(),
            user_name: joi_1.default.string().required(),
            user_email: joi_1.default.string().email().lowercase().required(),
            user_password: joi_1.default.string().min(8).required(),
            user_phone: joi_1.default.string().max(20).optional()
        });
    }
}
exports.BtoBSubAgencyValidator = BtoBSubAgencyValidator;
