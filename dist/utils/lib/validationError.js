"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../miscellaneous/statusCode"));
class ValidationErr extends Error {
    constructor(error) {
        super(error.array()[0].msg);
        (this.status = statusCode_1.default.HTTP_UNPROCESSABLE_ENTITY),
            (this.type = `Invalid input type for '${error.array()[0].path}'`);
        console.log(error.array()[0]);
    }
}
exports.default = ValidationErr;
