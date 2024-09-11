"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPrmotionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class AdminPrmotionValidator {
    constructor() {
        // create promo code validator
        this.createPromoCodeValidator = joi_1.default.object({
            code: joi_1.default.string().required(),
            discount_percentage: joi_1.default.number().required(),
            max_usage: joi_1.default.number().required(),
            expiry_date: joi_1.default.date().optional(),
        });
        // update promo code validator
        this.updatePromoCodeValidator = joi_1.default.object({
            code: joi_1.default.string().allow("").optional(),
            status: joi_1.default.number().valid(0, 1).optional(),
            discount_percentage: joi_1.default.number().optional(),
            max_usage: joi_1.default.number().optional(),
            expiry_date: joi_1.default.date().optional(),
        });
        // create offer validator
        this.createOfferValidator = joi_1.default.object({
            title: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            start_date: joi_1.default.date().required(),
            end_date: joi_1.default.date().required(),
            promo_code_id: joi_1.default.number().optional(),
        });
        // update offer validator
        this.updateOfferValidator = joi_1.default.object({
            title: joi_1.default.string().allow("").optional(),
            description: joi_1.default.string().allow("").optional(),
            start_date: joi_1.default.date().allow("").optional(),
            end_date: joi_1.default.date().allow("").optional(),
            promo_code_id: joi_1.default.number().allow("").optional(),
            status: joi_1.default.number().valid(0, 1).optional(),
        });
    }
}
exports.AdminPrmotionValidator = AdminPrmotionValidator;
