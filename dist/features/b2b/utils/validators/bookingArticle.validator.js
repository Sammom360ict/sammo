"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class BookingArticleValidator {
    constructor() {
        this.articleFilterQueryValidator = joi_1.default.object({
            title: joi_1.default.string(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
        });
    }
}
exports.default = BookingArticleValidator;
