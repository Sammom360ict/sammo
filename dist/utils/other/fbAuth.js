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
exports.verifyFacebookToken = void 0;
const customError_1 = __importDefault(require("../lib/customError"));
const axios_1 = __importDefault(require("axios"));
const verifyFacebookToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`;
    try {
        const response = yield axios_1.default.get(url);
        return response.data; // Response contains user's information
    }
    catch (error) {
        console.error("Error verifying Facebook token:", error.response.data);
        throw new customError_1.default("Invalid Facebook token", 401);
    }
});
exports.verifyFacebookToken = verifyFacebookToken;
