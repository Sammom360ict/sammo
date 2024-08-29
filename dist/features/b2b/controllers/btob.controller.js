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
exports.BtobController = void 0;
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const btob_service_1 = require("../services/btob.service");
const btob_validator_1 = require("../utils/validators/btob.validator");
class BtobController extends abstract_controller_1.default {
    constructor() {
        super(...arguments);
        this.service = new btob_service_1.BtobService();
        this.validator = new btob_validator_1.BtobValidator();
        //create application
        this.insertDeposit = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.insertDeposit(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //get applications
        this.getAllDepositRequestList = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getAllDepositRequestList(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //get single application
        this.getSingleApplication = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getSingleApplication(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.BtobController = BtobController;
