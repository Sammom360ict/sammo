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
const config_1 = __importDefault(require("../../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const staticData_1 = require("../miscellaneous/staticData");
class Lib {
    // make hashed password
    static hashPass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            return yield bcryptjs_1.default.hash(password, salt);
        });
    }
    // verify password
    static compare(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hashedPassword);
        });
    }
    // create token
    static createToken(creds, secret, maxAge) {
        return jsonwebtoken_1.default.sign(creds, secret, { expiresIn: maxAge });
    }
    // verify token
    static verifyToken(token, secret) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
    // generate random Number
    static otpGenNumber(length) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let otp = '';
        for (let i = 0; i < length; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            otp += numbers[randomNumber];
        }
        return otp;
    }
    // send email by nodemailer
    static sendEmail(email, emailSub, emailBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    auth: {
                        user: config_1.default.EMAIL_SEND_EMAIL_ID,
                        pass: config_1.default.EMAIL_SEND_PASSWORD,
                    },
                });
                const info = yield transporter.sendMail({
                    from: config_1.default.EMAIL_SEND_EMAIL_ID,
                    to: email,
                    subject: emailSub,
                    html: emailBody,
                });
                console.log('Message send: %s', info);
                return true;
            }
            catch (err) {
                console.log({ err });
                return false;
            }
        });
    }
    // compare object
    static compareObj(a, b) {
        return JSON.stringify(a) == JSON.stringify(b);
    }
    // get meal by code
    static getMeal(code) {
        return staticData_1.mealData.find((item) => item.code === code);
    }
    // get cabin by code
    static getCabin(code) {
        return staticData_1.cabinCode.find((item) => item.code === code);
    }
    // get time value
    static getTimeValue(timeString) {
        // Extract hours, minutes, and seconds
        let [time, timeZone] = timeString.split('+');
        if (!timeZone) {
            [time, timeZone] = timeString.split('-');
        }
        let [hours, minutes, seconds] = time.split(':');
        // Convert to milliseconds since midnight
        let timeValue = (parseInt(hours, 10) * 60 * 60 +
            parseInt(minutes, 10) * 60 +
            parseInt(seconds, 10)) *
            1000;
        // Adjust for time zone
        if (timeZone) {
            let [tzHours, tzMinutes] = timeZone.split(':');
            let timeZoneOffset = (parseInt(tzHours, 10) * 60 + parseInt(tzMinutes, 10)) * 60 * 1000;
            timeValue -= timeZoneOffset;
        }
        return timeValue;
    }
}
exports.default = Lib;
