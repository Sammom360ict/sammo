"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimeFormatter = void 0;
const customError_1 = __importDefault(require("./customError"));
const dateTimeFormatter = (date, time) => {
    const dateObject = new Date(date);
    const timeComponents = time.match(/(\d{2}:\d{2}:\d{2})/);
    if (dateObject && timeComponents) {
        const [hours, minutes, seconds] = timeComponents[1].split(':');
        dateObject.setUTCHours(Number(hours), Number(minutes), Number(seconds));
        const formattedDateTimeString = dateObject.toISOString().slice(0, 19);
        return formattedDateTimeString;
    }
    else {
        throw new customError_1.default('Invalid date or time format', 400);
    }
};
exports.dateTimeFormatter = dateTimeFormatter;
