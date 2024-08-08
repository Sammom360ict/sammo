"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonValidator_1 = __importDefault(require("../features/common/commonUtils/validators/commonValidator"));
const middleware_1 = __importDefault(require("../middleware/asyncWrapper/middleware"));
const customError_1 = __importDefault(require("../utils/lib/customError"));
const responseMessage_1 = __importDefault(require("../utils/miscellaneous/responseMessage"));
const statusCode_1 = __importDefault(require("../utils/miscellaneous/statusCode"));
class AbstractController {
    constructor() {
        this.commonValidator = new commonValidator_1.default();
        this.StatusCode = statusCode_1.default;
        this.asyncWrapper = new middleware_1.default();
    }
    error(message, status) {
        throw new customError_1.default(message || responseMessage_1.default.HTTP_INTERNAL_SERVER_ERROR, status || statusCode_1.default.HTTP_INTERNAL_SERVER_ERROR);
    }
}
exports.default = AbstractController;
