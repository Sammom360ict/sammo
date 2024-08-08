"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirlineCommissionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class AirlineCommissionValidator {
    constructor() {
        // create airline validator
        this.createAirlinesCommissionSchema = joi_1.default.object({
            airline_code: joi_1.default.string().required(),
            soto_commission: joi_1.default.number().optional(),
            from_dac_commission: joi_1.default.number().required(),
            to_dac_commission: joi_1.default.number().required(),
            capping: joi_1.default.number().valid(0, 1).required(),
            soto_allowed: joi_1.default.number().valid(0, 1).required(),
            domestic_commission: joi_1.default.number().optional(),
        });
        // get airline validator
        this.getAirlinesCommissionSchema = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            updated_at: joi_1.default.string().optional(),
            code: joi_1.default.string().optional(),
            name: joi_1.default.string().optional(),
        });
        // update airline validator
        this.updateAirlinesCommissionSchema = joi_1.default.object({
            soto_commission: joi_1.default.number().optional(),
            from_dac_commission: joi_1.default.number().optional(),
            to_dac_commission: joi_1.default.number().optional(),
            capping: joi_1.default.number().valid(0, 1).optional(),
            soto_allowed: joi_1.default.number().valid(0, 1).optional(),
            domestic_commission: joi_1.default.number().optional(),
        });
    }
}
exports.AirlineCommissionValidator = AirlineCommissionValidator;
