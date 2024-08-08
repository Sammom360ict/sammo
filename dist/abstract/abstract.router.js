"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commonValidator_1 = __importDefault(require("../features/common/commonUtils/validators/commonValidator"));
const fileFolders_1 = __importDefault(require("../utils/miscellaneous/fileFolders"));
const uploader_1 = __importDefault(require("../middleware/uploader/uploader"));
class AbstractRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.commonValidator = new commonValidator_1.default();
        this.uploader = new uploader_1.default();
        this.fileFolders = fileFolders_1.default;
    }
}
exports.default = AbstractRouter;
