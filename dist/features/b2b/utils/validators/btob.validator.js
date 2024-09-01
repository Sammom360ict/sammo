"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtobValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class BtobValidator {
    constructor() {
        //insert deposit
        this.insertDeposit = joi_1.default.object({
            bank_name: joi_1.default.string().optional(),
            amount: joi_1.default.number().required(),
            payment_date: joi_1.default.date().required(),
            remarks: joi_1.default.string().optional(),
        });
    }
}
exports.BtobValidator = BtobValidator;
