"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../app/database");
const rootModel_1 = __importDefault(require("../models/rootModel"));
const manageFile_1 = __importDefault(require("../utils/lib/manageFile"));
const responseMessage_1 = __importDefault(require("../utils/miscellaneous/responseMessage"));
const schema_1 = __importDefault(require("../utils/miscellaneous/schema"));
const statusCode_1 = __importDefault(require("../utils/miscellaneous/statusCode"));
class AbstractServices {
    constructor() {
        this.db = database_1.db;
        this.manageFile = new manageFile_1.default();
        this.ResMsg = responseMessage_1.default;
        this.StatusCode = statusCode_1.default;
        this.Model = new rootModel_1.default();
        this.schema = new schema_1.default();
    }
}
exports.default = AbstractServices;
