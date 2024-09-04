"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class BtobTravelerValidator {
    constructor() {
        // create traveler schema
        this.create = joi_1.default.object({
            type: joi_1.default.string()
                .valid("ADT", "INF", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11")
                .required(),
            reference: joi_1.default.string()
                .valid("MISS", "MASTER", "MS", "MR", "MRS")
                .required(),
            mid_name: joi_1.default.string().required(),
            sur_name: joi_1.default.string().required(),
            date_of_birth: joi_1.default.date().required(),
            passport_number: joi_1.default.string().optional(),
            passport_expire_date: joi_1.default.date().optional(),
            city: joi_1.default.string().optional(),
            country: joi_1.default.number().optional(),
            email: joi_1.default.string().email().lowercase().required(),
            phone: joi_1.default.string().required(),
            frequent_flyer_airline: joi_1.default.string().optional(),
            frequent_flyer_number: joi_1.default.string().optional(),
            gender: joi_1.default.string().optional(),
        });
        // get traveler schema
        this.get = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            name: joi_1.default.string().optional(),
            status: joi_1.default.number().optional(),
        });
        // update traveler schema
        this.update = joi_1.default.object({
            type: joi_1.default.string()
                .valid("ADT", "INF", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11")
                .optional(),
            reference: joi_1.default.string()
                .valid("MISS", "MASTER", "MS", "MR", "MRS")
                .optional(),
            mid_name: joi_1.default.string().allow("").optional(),
            sur_name: joi_1.default.string().allow("").optional(),
            date_of_birth: joi_1.default.date().optional(),
            passport_number: joi_1.default.string().allow("").optional(),
            passport_expire_date: joi_1.default.date().optional(),
            city: joi_1.default.string().allow("").optional(),
            country: joi_1.default.number().optional(),
            email: joi_1.default.string().email().lowercase().optional(),
            phone: joi_1.default.string().optional(),
            frequent_flyer_airline: joi_1.default.string().allow("").optional(),
            frequent_flyer_number: joi_1.default.string().allow("").optional(),
            gender: joi_1.default.string().optional(),
            status: joi_1.default.number().valid(1, 0).optional(),
        });
    }
}
exports.default = BtobTravelerValidator;
