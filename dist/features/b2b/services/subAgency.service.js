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
exports.BtoBSubAgencyService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
class BtoBSubAgencyService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create agency
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { agency_id, id } = req.agency;
                const { agency_name, agency_email, agency_phone, commission, user_name, user_email, user_password, user_phone, } = req.body;
                const files = req.files || [];
                const agencyModel = this.Model.agencyModel(trx);
                const agencyBody = {
                    agency_name,
                    email: agency_email,
                    phone: agency_phone,
                    commission,
                    created_by: id,
                    ref_id: agency_id,
                };
                const checkEmail = yield agencyModel.getSingleUser({ email: user_email });
                if (checkEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Email already exist.",
                    };
                }
                const hashed_password = yield lib_1.default.hashPass(user_password);
                const userBody = {
                    name: user_name,
                    email: user_email,
                    hashed_password,
                    mobile_number: user_phone,
                };
                files.forEach((item) => {
                    if (item.fieldname === "agency_logo") {
                        agencyBody["agency_logo"] = item.filename;
                    }
                    else if (item.fieldname === "user_photo") {
                        userBody["photo"] = item.filename;
                    }
                });
                const agency = yield agencyModel.createAgency(agencyBody);
                userBody["agency_id"] = agency[0].id;
                yield agencyModel.createAgencyUser(userBody);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: {
                        id: agency[0].id,
                        logo: agencyBody.agency_logo,
                        user_photo: userBody.photo,
                    },
                };
            }));
        });
    }
    // get agency
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, status, limit, skip } = req.query;
            const { agency_id } = req.agency;
            const agencyModel = this.Model.agencyModel();
            const { data, total } = yield agencyModel.getAgency({
                ref_id: agency_id,
                name: name,
                status: status,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get single agency
    getSingle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { agency_id } = req.agency;
            const { limit, skip } = req.query;
            const agencyModel = this.Model.agencyModel();
            const data = yield agencyModel.getSingleAgency(Number(id), agency_id);
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const users = yield agencyModel.getUser({
                agency_id: Number(id),
                limit: limit,
                skip: skip,
            });
            const _a = data[0], { ref_id } = _a, restAgencyData = __rest(_a, ["ref_id"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign(Object.assign({}, restAgencyData), { users }),
            };
        });
    }
}
exports.BtoBSubAgencyService = BtoBSubAgencyService;
