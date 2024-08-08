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
const manageFile_1 = __importDefault(require("../../utils/lib/manageFile"));
class ErrorHandler {
    constructor() {
        /**
         * handleErrors
         */
        this.handleErrors = (err, req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            // // file removing starts
            const files = req.upFiles || [];
            if (files.length) {
                yield this.manageFile.deleteFromCloud(files);
            }
            // if (err instanceof CustomError) {
            //   this.customError.message =
            //     err.message || 'Something went wrong, please try again later!';
            //   this.customError.type = err.type;
            //   this.customError.status = err.status;
            // } else {
            //   this.customError.message =
            //     'Something went wrong, please try again later!';
            //   this.customError.type = 'Internal Server Error';
            // }
            console.log(err, 'custom error');
            res
                .status(err.status || 500)
                .json({ success: false, message: err.message });
        });
        this.customError = {
            success: false,
            message: 'Internal server error!',
        };
        this.manageFile = new manageFile_1.default();
    }
}
exports.default = ErrorHandler;
