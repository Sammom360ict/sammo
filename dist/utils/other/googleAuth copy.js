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
const google_auth_library_1 = require("google-auth-library");
const config_1 = __importDefault(require("../../config/config"));
const customError_1 = __importDefault(require("../lib/customError"));
class GoogleAuth {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(config_1.default.GOOGLE_CLIENT_ID);
    }
    verifyAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify the token and get user info
                const ticket = yield this.client.getTokenInfo(accessToken);
                return ticket;
            }
            catch (error) {
                console.error("Access token verification failed:", error);
                throw new customError_1.default("Invalid access token", 401);
            }
        });
    }
}
exports.default = GoogleAuth;
