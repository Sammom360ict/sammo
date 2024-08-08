"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const constants_1 = require("../utils/miscellaneous/constants");
const SocketServer = (app) => {
    const server = http_1.default.createServer(app);
    exports.io = new socket_io_1.Server(server, {
        cors: { origin: constants_1.origin },
    });
    return server;
};
exports.SocketServer = SocketServer;
