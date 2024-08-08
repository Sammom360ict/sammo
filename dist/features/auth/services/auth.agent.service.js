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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const config_1 = __importDefault(require("../../../config/config"));
class AgentAuthService extends abstract_service_1.default {
    //login
    loginService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            const model = this.Model.agencyModel();
            const checkUser = yield model.getSingleUser({ email });
            console.log(checkUser);
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const _b = checkUser[0], { hashed_password: hashPass, agency_id } = _b, rest = __rest(_b, ["hashed_password", "agency_id"]);
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const getAgency = yield model.getSingleAgency(Number(agency_id));
            if (rest.status == false) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_FORBIDDEN,
                    message: "Your account has been disabled"
                };
            }
            if (((_a = getAgency[0]) === null || _a === void 0 ? void 0 : _a.status) == false) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_FORBIDDEN,
                    message: "Your agency account has been disabled"
                };
            }
            const token_data = {
                id: rest.id,
                name: rest.name,
                email: rest.email,
                mobile_number: rest.mobile_number,
                photo: rest.photo,
                user_status: rest.status,
                agency_id: agency_id,
                agency_logo: getAgency[0].agency_logo,
                agency_name: getAgency[0].agency_name,
                agency_status: getAgency[0].status
            };
            const token = lib_1.default.createToken(token_data, config_1.default.JWT_SECRET_ADMIN, '48h');
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: token_data,
                token,
            };
        });
    }
    //forget pass
    forgetPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, email, password } = req.body;
            const token_verify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_AGENT);
            if (!token_verify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verify_email } = token_verify;
            if (email === verify_email) {
                const hashed_pass = yield lib_1.default.hashPass(password);
                const model = this.Model.agencyModel();
                const get_user = yield model.getSingleUser({ email });
                yield model.updateAgencyUser({ hashed_password: hashed_pass }, get_user[0].id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.PASSWORD_CHANGED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_FORBIDDEN,
                    message: this.StatusCode.HTTP_FORBIDDEN,
                };
            }
        });
    }
}
exports.default = AgentAuthService;
