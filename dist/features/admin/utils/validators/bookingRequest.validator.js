"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminBookingRequestValidator {
    constructor() {
        //update validator
        this.updateBookingRequestApplication = joi_1.default.object({
            status: joi_1.default.string().valid("approved", "cancelled").required(),
            note: joi_1.default.string().optional(),
        });
        // manual issue ticket validator
        this.manualTicketIssueValidator = joi_1.default.object({
            pax_ticket: joi_1.default.array().items(joi_1.default.object({
                traveler_id: joi_1.default.number().required(),
                ticket_number: joi_1.default.string().required(),
            }).required()),
        });
    }
}
exports.default = AdminBookingRequestValidator;
