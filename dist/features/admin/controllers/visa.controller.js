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
exports.AdminVisaController = void 0;
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const visa_validator_1 = require("../utils/validators/visa.validator");
const visa_service_1 = require("../services/visa.service");
class AdminVisaController extends abstract_controller_1.default {
    constructor() {
        super(...arguments);
        this.validator = new visa_validator_1.AdminVisaValidator();
        this.service = new visa_service_1.AdminVisaService();
        //create visa
        this.createVisa = this.asyncWrapper.wrap({ bodySchema: this.validator.CreateVisaSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.createVisa(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //get visa
        this.getVisa = this.asyncWrapper.wrap({ querySchema: this.validator.GetVisaSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getVisa(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //get single visa
        this.getSingleVisa = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getSingleVisa(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //update visa
        this.updateVisa = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.UpdateVisaSchema
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.updateVisa(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //get B2C applications
        this.getB2CApplications = this.asyncWrapper.wrap({ querySchema: this.validator.VisaApplicationFilterSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.getB2CApplications(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //get B2C applications
        this.getB2CSingleApplication = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.service.getB2CSingleApplication(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //create B2C tracking of application
        this.createB2CTrackingOfApplication = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.VisaTrackingPayloadSchema
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.service.createB2CTrackingOfApplication(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //get B2B applications
        this.getB2BApplications = this.asyncWrapper.wrap({ querySchema: this.validator.VisaApplicationFilterSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.service.getB2BApplications(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //get B2B applications
        this.getB2BSingleApplication = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.service.getB2BSingleApplication(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //create B2B tracking of application
        this.createB2BTrackingOfApplication = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.VisaTrackingPayloadSchema
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.service.createB2BTrackingOfApplication(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.AdminVisaController = AdminVisaController;
