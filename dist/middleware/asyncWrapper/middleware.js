"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../utils/miscellaneous/statusCode"));
const customError_1 = __importDefault(require("../../utils/lib/customError"));
class Wrapper {
    // CONTROLLER ASYNCWRAPPER
    wrap(schema, cb) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { params, query, body } = req;
                if (schema) {
                    if (schema.bodySchema) {
                        const validateBody = yield schema.bodySchema.validateAsync(body);
                        req.body = validateBody;
                    }
                    if (schema.paramSchema) {
                        const validateParams = yield schema.paramSchema.validateAsync(params);
                        req.params = validateParams;
                    }
                    if (schema.querySchema) {
                        const validateQuery = yield schema.querySchema.validateAsync(query);
                        req.query = validateQuery;
                    }
                }
                yield cb(req, res, next);
            }
            catch (err) {
                console.log({ err }, "error from wrap");
                if (err.isJoi) {
                    res.status(statusCode_1.default.HTTP_UNPROCESSABLE_ENTITY).json({
                        success: false,
                        message: err.message,
                    });
                }
                else {
                    next(new customError_1.default(err.message, err.status));
                }
            }
        });
    }
}
exports.default = Wrapper;
