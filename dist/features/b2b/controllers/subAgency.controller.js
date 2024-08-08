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
exports.BtoBSubAgencyController = void 0;
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const subAgency_service_1 = require("../services/subAgency.service");
const subAgency_validator_1 = require("../utils/validators/subAgency.validator");
class BtoBSubAgencyController extends abstract_controller_1.default {
    constructor() {
        super();
        this.services = new subAgency_service_1.BtoBSubAgencyService();
        this.validator = new subAgency_validator_1.BtoBSubAgencyValidator();
        // create controller
        this.create = this.asyncWrapper.wrap({ bodySchema: this.validator.createSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.services.create(req), { code } = _a, rest = __rest(_a, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // get controller
        this.get = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.services.get(req), { code } = _b, rest = __rest(_b, ["code"]);
            res.status(code).json(rest);
        }));
        // get single controller
        this.getSingle = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.services.getSingle(req), { code } = _c, rest = __rest(_c, ["code"]);
            res.status(code).json(rest);
        }));
    }
}
exports.BtoBSubAgencyController = BtoBSubAgencyController;
