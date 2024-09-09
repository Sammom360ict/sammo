"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ArticleValidator {
    constructor() {
        this.createArticlePayloadValidator = joi_1.default.object({
            title: joi_1.default.string().min(1).max(500).required(),
            description: joi_1.default.string().required(),
            thumbnail_details: joi_1.default.string().max(500).optional(),
        });
        this.articleListFilterQueryValidator = joi_1.default.object({
            title: joi_1.default.string(),
            status: joi_1.default.boolean(),
            deleted: joi_1.default.boolean(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
        });
        this.updateArticlePayloadValidator = joi_1.default.object({
            title: joi_1.default.string().min(1).max(500),
            description: joi_1.default.string(),
            thumbnail_details: joi_1.default.string().max(500),
            status: joi_1.default.boolean(),
        });
    }
}
exports.default = ArticleValidator;
