"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.default = CustomError;
