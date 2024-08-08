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
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const bookingTraveler_service_1 = __importDefault(require("../services/bookingTraveler.service"));
const bookingTraveler_validator_1 = __importDefault(require("../utils/validators/bookingTraveler.validator"));
class BookingTravelerController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new bookingTraveler_service_1.default();
        this.validator = new bookingTraveler_validator_1.default();
        // create traveler controller
        this.create = this.asyncWrapper.wrap({ bodySchema: this.validator.create }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.create(req), { code } = _a, rest = __rest(_a, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // get traveler controller
        this.get = this.asyncWrapper.wrap({ querySchema: this.validator.get }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.get(req), { code } = _b, rest = __rest(_b, ["code"]);
            res.status(code).json(rest);
        }));
        // get single traveler controller
        this.getSingle = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getSingle(req), { code } = _c, rest = __rest(_c, ["code"]);
            res.status(code).json(rest);
        }));
        // update traveler controller
        this.update = this.asyncWrapper.wrap({
            bodySchema: this.validator.update,
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.update(req), { code } = _d, rest = __rest(_d, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
        // update traveler controller
        this.delete = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.delete(req), { code } = _e, rest = __rest(_e, ["code"]);
            if (rest.success) {
                res.status(code).json(rest);
            }
            else {
                this.error(rest.message, code);
            }
        }));
    }
}
exports.default = BookingTravelerController;
