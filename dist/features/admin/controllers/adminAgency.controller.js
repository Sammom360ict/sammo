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
exports.AdminAgencyController = void 0;
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const admin_agency_validator_1 = require("../utils/validators/admin.agency.validator");
const adminAgency_service_1 = require("../services/adminAgency.service");
class AdminAgencyController extends abstract_controller_1.default {
    constructor() {
        super();
        this.services = new adminAgency_service_1.AdminAgencyService();
        this.validator = new admin_agency_validator_1.AdminAgencyValidator();
        // deposit controller
        this.depositToAgency = this.asyncWrapper.wrap({ bodySchema: this.validator.depositToAgencySchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.services.depositToAgency(req), { code } = _a, rest = __rest(_a, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // get transaction controller
        this.getTransaction = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.services.getTransaction(req), { code } = _b, rest = __rest(_b, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // create controller
        this.create = this.asyncWrapper.wrap({ bodySchema: this.validator.createAgencySchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.services.create(req), { code } = _c, rest = __rest(_c, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // get controller
        this.get = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.services.get(req), { code } = _d, rest = __rest(_d, ["code"]);
            res.status(code).json(rest);
        }));
        // get single controller
        this.getSingle = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.services.getSingle(req), { code } = _e, rest = __rest(_e, ["code"]);
            res.status(code).json(rest);
        }));
        // update controller
        this.update = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.updateAgencySchema,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.services.update(req), { code } = _f, rest = __rest(_f, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // create agency user controller
        this.createUser = this.asyncWrapper.wrap({ bodySchema: this.validator.createAgencyUserSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.services.createUser(req), { code } = _g, rest = __rest(_g, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // update agency user controller
        this.updateUser = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.updateAgencyUserSchema,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.services.updateUser(req), { code } = _h, rest = __rest(_h, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
    }
}
exports.AdminAgencyController = AdminAgencyController;
