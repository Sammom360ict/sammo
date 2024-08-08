"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ProfileValidator {
    constructor() {
        this.editProfile = joi_1.default.object({
            username: joi_1.default.string().optional().messages({
                'string.base': 'Username must be a string',
                'any.required': 'Username is required'
            }),
            first_name: joi_1.default.string().optional().messages({
                'string.base': 'First name must be a string',
                'any.required': 'First name is required'
            }),
            last_name: joi_1.default.string().optional().messages({
                'string.base': 'Last name must be a string',
                'any.required': 'Last name is required'
            }),
            gender: joi_1.default.string().valid('Male', 'Female', 'Other').optional().messages({
                'any.only': 'Gender must be Male, Female, or Other'
            })
        });
    }
}
exports.default = ProfileValidator;
