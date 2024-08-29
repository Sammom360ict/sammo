"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtobValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class BtobValidator {
    constructor() {
        //visa application schema
        this.applicationSchema = joi_1.default.object({
            visa_id: joi_1.default.number().required(),
            from_date: joi_1.default.date().required(),
            to_date: joi_1.default.date().required(),
            nationality: joi_1.default.string().required(),
            residence: joi_1.default.string().required(),
            traveler: joi_1.default.number().required(),
            contact_email: joi_1.default.string().required().email().lowercase(),
            contact_number: joi_1.default.string().required().max(20),
            whatsapp_number: joi_1.default.string().optional().max(20),
        });
    }
}
exports.BtobValidator = BtobValidator;
