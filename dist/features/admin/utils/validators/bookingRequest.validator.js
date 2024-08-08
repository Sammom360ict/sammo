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
            status: joi_1.default.string().valid('Approved', 'Cancelled').required(),
            note: joi_1.default.string().optional(),
        });
    }
}
exports.default = AdminBookingRequestValidator;
