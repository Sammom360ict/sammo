"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminVisaValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class AdminVisaValidator {
    constructor() {
        //create visa validator
        this.CreateVisaSchema = joi_1.default.object({
            country_id: joi_1.default.number().required(),
            visa_fee: joi_1.default.number().required().max(9999999999999999.99),
            processing_fee: joi_1.default.number().required().max(9999999999999999.99),
            max_validity: joi_1.default.number().required(),
            type: joi_1.default.string().required(),
            description: joi_1.default.string().optional(),
            stay_validity: joi_1.default.number().required(),
            visa_mode: joi_1.default.string().optional(),
            processing_type: joi_1.default.string().optional(),
            documents_details: joi_1.default.string().optional()
        });
        //get visa validator
        this.GetVisaSchema = joi_1.default.object({
            country_id: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
        });
        //update visa validator
        this.UpdateVisaSchema = joi_1.default.object({
            country_id: joi_1.default.number().optional(),
            visa_fee: joi_1.default.number().optional().max(9999999999999999.99),
            processing_fee: joi_1.default.number().optional().max(9999999999999999.99),
            max_validity: joi_1.default.number().optional(),
            type: joi_1.default.string().optional(),
            description: joi_1.default.string().optional(),
            stay_validity: joi_1.default.number().optional(),
            visa_mode: joi_1.default.string().optional(),
            processing_type: joi_1.default.string().optional(),
            documents_details: joi_1.default.string().optional(),
            status: joi_1.default.boolean().optional(),
        });
        //visa application filter schema
        this.VisaApplicationFilterSchema = joi_1.default.object({
            filter: joi_1.default.string().optional(),
            from_date: joi_1.default.date().optional(),
            to_date: joi_1.default.date().optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
        });
        //visa tracking payload schema
        this.VisaTrackingPayloadSchema = joi_1.default.object({
            status: joi_1.default.string().required(),
            details: joi_1.default.string().required(),
        });
    }
}
exports.AdminVisaValidator = AdminVisaValidator;
