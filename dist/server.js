"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const config_1 = __importDefault(require("./config/config"));
const app = new app_1.default(config_1.default.PORT);
app.startServer();
exports.default = app.app;
