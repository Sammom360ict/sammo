"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class BookingProfileValidator {
    constructor() {
        this.editProfile = joi_1.default.object({
            name: joi_1.default.string().min(1).max(255),
            mobile_number: joi_1.default.string().min(1).max(20),
        });
    }
}
exports.default = BookingProfileValidator;
