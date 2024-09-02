"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2BBookingSupportValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class B2BBookingSupportValidator {
    constructor() {
        //create support schema
        this.createSupportSchema = joi_1.default.object({
            booking_id: joi_1.default.number().required(),
            support_type: joi_1.default.string().required(),
            ticket_number: joi_1.default.alternatives()
                .try(joi_1.default.array()
                .items(joi_1.default.object({
                traveler_id: joi_1.default.number().required(),
                ticket_number: joi_1.default.string().required(),
            }).required())
                .required(), joi_1.default.string().custom((value, helpers) => {
                try {
                    const parsedDeduction = JSON.parse(value);
                    return parsedDeduction;
                }
                catch (error) {
                    console.error("Error parsing ticket number:", error);
                    return helpers.error("any.invalid");
                }
            }))
                .required(),
            message: joi_1.default.string().optional(),
        });
        //create message schema
        this.createMessageSchema = joi_1.default.object({
            message: joi_1.default.string().optional(),
        });
        //close schema
        this.closeSchema = joi_1.default.object({
            status: joi_1.default.string().valid("approved", "rejected").required(),
        });
    }
}
exports.B2BBookingSupportValidator = B2BBookingSupportValidator;
