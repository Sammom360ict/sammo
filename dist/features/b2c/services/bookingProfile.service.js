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
class BookingProfileService extends abstract_service_1.default {
    //get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const model = this.Model.userModel();
            const profile = yield model.getProfileDetails({ id });
            console.log(profile);
            const _a = profile[0], { password_hash } = _a, rest = __rest(_a, ["password_hash"]);
            console.log(rest);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: rest,
            };
        });
    }
    //edit profile
    editProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const { username, first_name, last_name, gender, photo } = req.body;
            const model = this.Model.userModel();
            if (req.body.username) {
                const check_username = yield model.getProfileDetails({ username: req.body.username });
                if (check_username.length) {
                    if (check_username[0].id !== id) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: this.ResMsg.USERNAME_EXISTS,
                        };
                    }
                }
            }
            const update_profile = yield model.updateProfile({ username, first_name, last_name, gender, photo }, { id });
            if (update_profile) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: req.body,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }
        });
    }
    //change password
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const { old_password, new_password } = req.body;
            const model = this.Model.userModel();
            const user_details = yield model.getProfileDetails({ id });
            if (!user_details.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const verify_password = yield lib_1.default.compare(old_password, user_details[0].password_hash);
            if (!verify_password) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.PASSWORD_DOES_NOT_MATCH,
                };
            }
            const hashed_password = yield lib_1.default.hashPass(new_password);
            const password_changed = yield model.updateProfile({ password_hash: hashed_password }, { id });
            if (password_changed) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.PASSWORD_CHANGED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }
        });
    }
}
exports.default = BookingProfileService;
