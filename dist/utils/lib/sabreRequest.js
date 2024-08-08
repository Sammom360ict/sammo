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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config/config"));
const rootModel_1 = __importDefault(require("../../models/rootModel"));
const constants_1 = require("../miscellaneous/constants");
const BASE_URL = config_1.default.SABRE_URL;
class SabreRequests {
    // get request
    getRequest(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authModel = new rootModel_1.default().commonModel();
                const token = yield authModel.getEnv(constants_1.SABRE_TOKEN_ENV);
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const apiUrl = BASE_URL + endpoint;
                const response = yield axios_1.default.get(apiUrl, { headers });
                const data = response.data;
                return { code: response.status, data };
            }
            catch (error) {
                console.error('Error calling API:', error.response.status);
                return { code: error.response.status, data: [] };
            }
        });
    }
    // post request
    postRequest(endpoint, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = BASE_URL + endpoint;
                const authModel = new rootModel_1.default().commonModel();
                const token = yield authModel.getEnv(constants_1.SABRE_TOKEN_ENV);
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const response = yield axios_1.default.post(apiUrl, requestData, { headers });
                return response.data;
            }
            catch (error) {
                console.log(error.response);
                return false;
            }
        });
    }
}
exports.default = SabreRequests;
