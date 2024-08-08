"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class BookingRequestValidator {
    constructor() {
        //traveler schema
        this.travelerSchema = joi_1.default.object({
            type: joi_1.default.string()
                .valid('ADT', 'INF', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11')
                .required(),
            title: joi_1.default.string()
                .valid('MISS', 'MASTER', 'MS', 'MR', 'MRS')
                .required(),
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            date_of_birth: joi_1.default.date().required(),
            passport_number: joi_1.default.string().optional(),
            passport_expiry_date: joi_1.default.date().optional(),
            city_id: joi_1.default.number().required(),
            email: joi_1.default.string().email().lowercase().required(),
            phone: joi_1.default.string().required(),
            frequent_flyer_airline: joi_1.default.string().optional(),
            frequent_flyer_number: joi_1.default.string().optional(),
        });
        //create traveler schema
        this.createTravelerSchema = joi_1.default.object({
            flight_id: joi_1.default.string().required().messages({
                'any.required': 'Provide valid flight id',
            }),
            passengers: joi_1.default.array()
                .items(this.travelerSchema.required())
                .required(),
        });
    }
}
exports.default = BookingRequestValidator;
