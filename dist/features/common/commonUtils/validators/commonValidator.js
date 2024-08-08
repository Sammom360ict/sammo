"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validatorConstants_1 = require("./validatorConstants");
class CommonValidator {
    constructor() {
        // common login input validator
        this.loginValidator = joi_1.default.object({
            email: joi_1.default.string().email().required().lowercase().messages({
                'string.base': 'Enter valid email',
                'string.email': 'Enter valid email',
                'any.required': 'Email is required',
            }),
            password: joi_1.default.string().min(8).required().messages({
                'string.base': 'Enter valid password',
                'string.min': 'Enter valid password minimum length 8',
                'any.required': 'Password is required',
            }),
        });
        //common register validator
        this.registerValidator = joi_1.default.object({
            username: joi_1.default.string().min(1).max(255).required(),
            first_name: joi_1.default.string().min(1).max(255).required(),
            last_name: joi_1.default.string().min(1).max(255).required(),
            gender: joi_1.default.string().valid('Male', 'Female', 'Other').required(),
            email: joi_1.default.string().email().lowercase().min(1).max(255).required(),
            password: joi_1.default.string().min(8).max(100).required(),
            phone_number: joi_1.default.string().min(7).max(20).required(),
        });
        //single param validator
        this.singleParamValidator = joi_1.default.object({
            id: joi_1.default.number().required(),
        });
        // single param string validator
        this.singleParamStringValidator = (idFieldName = 'id') => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.string().required();
            return joi_1.default.object(schemaObject);
        };
        // common forget password input validator
        this.commonForgetPassInputValidation = joi_1.default.object({
            token: joi_1.default.string().required().messages({
                'string.base': 'Provide valid token',
                'any.required': 'Token is required',
            }),
            email: joi_1.default.string().email().optional().lowercase().messages({
                'string.base': 'Provide valid email',
                'string.email': 'Provide valid email',
            }),
            password: joi_1.default.string().min(8).required().messages({
                'string.base': 'Provide valid password',
                'string.min': "Please provide valid password that's length must be min 8",
                'any.required': 'Password is required',
            }),
        });
        // send email otp input validator
        this.sendOtpInputValidator = joi_1.default.object({
            type: joi_1.default.string()
                .valid(...validatorConstants_1.SEND_OTP_TYPES)
                .required()
                .messages({
                'string.base': 'Please enter valid OTP type',
                'any.only': 'Please enter valid OTP type',
                'any.required': 'OTP type is required',
            }),
            email: joi_1.default.string().email().lowercase().required().messages({
                'string.base': 'Enter valid email address',
                'string.email': 'Enter valid email address',
                'any.required': 'Email is required',
            }),
        });
        // match email otp input validator
        this.matchEmailOtpInputValidator = joi_1.default.object({
            email: joi_1.default.string().email().lowercase().required().messages({
                'string.base': 'Enter valid email',
                'string.email': 'Enter valid email',
                'any.required': 'Email is required',
            }),
            otp: joi_1.default.string().required().messages({
                'string.base': 'Enter valid otp',
                'any.required': 'OTP is required',
            }),
            type: joi_1.default.string()
                .valid(...validatorConstants_1.SEND_OTP_TYPES)
                .required()
                .messages({
                'string.base': 'Enter valid otp type',
                'any.only': 'Enter valid otp type',
                'any.required': 'OTP type is required',
            }),
        });
        // common change password input validation
        this.changePassInputValidation = joi_1.default.object({
            old_password: joi_1.default.string().min(8).required().messages({
                'string.base': 'Provide a valid old password',
                'string.min': 'Provide a valid old password minimum length is 8',
                'any.required': 'Old password is required',
            }),
            new_password: joi_1.default.string().min(8).required().messages({
                'string.base': 'Provide a valid new password',
                'string.min': 'Provide a valid new password minimum length is 8',
                'any.required': 'New password is required',
            }),
        });
        //Create airport schema
        this.createAirportSchema = joi_1.default.object({
            country_id: joi_1.default.number().required(),
            name: joi_1.default.string().max(500).required(),
            iata_code: joi_1.default.string().max(12).required(),
            city: joi_1.default.number().optional(),
        });
        //update airport schema
        this.updateAirportSchema = joi_1.default.object({
            country_id: joi_1.default.number().optional(),
            name: joi_1.default.string().max(500).optional(),
            iata_code: joi_1.default.string().max(12).optional(),
            city: joi_1.default.number().optional(),
        });
        //airport filter
        this.airportFilterSchema = joi_1.default.object({
            country_id: joi_1.default.number().optional(),
            name: joi_1.default.string().optional(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
        });
        //insert airlines
        this.insertAirlines = joi_1.default.object({
            code: joi_1.default.string().max(12).required(),
            name: joi_1.default.string().max(500).required(),
        });
        //update airlines
        this.updateAirlines = joi_1.default.object({
            code: joi_1.default.string().max(12).optional(),
            name: joi_1.default.string().max(500).optional(),
        });
        //airline filter
        this.airlineFilterSchema = joi_1.default.object({
            code: joi_1.default.string().optional(),
            name: joi_1.default.string().optional(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
        });
        //visa filter
        this.visaListSchema = joi_1.default.object({
            country_id: joi_1.default.number().optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
        });
    }
}
exports.default = CommonValidator;
