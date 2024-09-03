"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
// flight booking validator schema
class FlightBookingValidator {
    constructor() {
        // get all flight booking validator
        this.getAllFlightBookingSchema = joi_1.default.object({
            status: joi_1.default.string().optional(),
            pnr: joi_1.default.string().optional(),
            limit: joi_1.default.string().optional(),
            skip: joi_1.default.string().optional(),
            from_date: joi_1.default.string().optional(),
            to_date: joi_1.default.string().optional(),
        });
        this.flightBookingQuerySchema = joi_1.default.object({
            search_id: joi_1.default.string().required(),
        });
        this.passengerSchema = joi_1.default.object({
            type: joi_1.default.string()
                .valid("ADT", "INF", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11")
                .required()
                .messages({
                "any.required": "Provide valid passenger type",
                "any.only": "Invalid passenger type",
            }),
            reference: joi_1.default.string()
                .valid("MISS", "MASTER", "MS", "MR", "MRS")
                .required()
                .messages({
                "any.required": "Provide valid passenger reference",
            }),
            mid_name: joi_1.default.string().required().messages({
                "any.required": "Provide valid mid name",
            }),
            sur_name: joi_1.default.string().required().messages({
                "any.required": "Provide valid sur name",
            }),
            phone: joi_1.default.string().required().messages({
                "any.required": "Provide valid phone",
            }),
            date_of_birth: joi_1.default.string().required().messages({
                "any.required": "Provide valid date of birth",
            }),
            gender: joi_1.default.string()
                .valid("M", "F", "FI", "MI", "U", "UI", "X", "XI")
                .required()
                .messages({
                "any.required": "Provide valid gender",
                "any.only": "Invalid gender",
            }),
            email: joi_1.default.string().email().required().messages({
                "any.required": "Provide valid email",
                "string.email": "Invalid email format",
            }),
            address: joi_1.default.string().allow("").optional().messages({
                "string.empty": "Address must be a string",
            }),
            post_code: joi_1.default.string().allow("").optional().messages({
                "string.empty": "post_code must be a string",
            }),
            city: joi_1.default.string().allow("").optional().messages({
                "string.empty": "city must be a string",
            }),
            country: joi_1.default.number().optional(),
            issuingCountryCode: joi_1.default.string().allow("").optional(),
            residenceCountryCode: joi_1.default.string().allow("").optional(),
            expiryDate: joi_1.default.string().optional(),
            documentNumber: joi_1.default.string().allow("").optional(),
            passport_number: joi_1.default.string().optional(),
            passport_expire_date: joi_1.default.string().optional(),
            save_information: joi_1.default.boolean().optional(),
        });
        this.pnrCreateSchema = joi_1.default.object({
            flight_id: joi_1.default.string().required().messages({
                "any.required": "Provide valid flight id",
            }),
            passengers: joi_1.default.alternatives()
                .try(joi_1.default.array().items(this.passengerSchema.required()).required(), joi_1.default.string().custom((value, helpers) => {
                try {
                    const parsedDeduction = JSON.parse(value);
                    return parsedDeduction;
                }
                catch (error) {
                    console.error("Error parsing passengers field:", error);
                    return helpers.error("any.invalid");
                }
            }))
                .required(),
        });
        // TICKET ISSUE SCHEMA
        this.ticketIssueSchema = joi_1.default.object({
            booking_id: joi_1.default.number().required().messages({
                "any.required": "Provide valid booking id",
            }),
        });
    }
}
exports.default = FlightBookingValidator;
