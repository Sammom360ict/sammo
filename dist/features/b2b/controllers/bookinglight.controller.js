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
const bookinglight_service_1 = __importDefault(require("../services/bookinglight.service"));
const bookingFlight_validator_1 = __importDefault(require("../utils/validators/bookingFlight.validator"));
class BookingFlightController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new bookinglight_service_1.default();
        this.validator = new bookingFlight_validator_1.default();
        // Search flight
        this.flightSearch = this.asyncWrapper.wrap({ bodySchema: this.validator.flightSearchSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.flightSearch(req), { code } = _a, rest = __rest(_a, ["code"]);
            res.status(code).json(rest);
        }));
        // Filter flight
        this.flightFilter = this.asyncWrapper.wrap({ querySchema: this.validator.flightFilterSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.flightFilter(req), { code } = _b, rest = __rest(_b, ["code"]);
            res.status(code).json(rest);
        }));
        // revalidate flight
        this.revalidate = this.asyncWrapper.wrap({ paramSchema: this.validator.flightRevalidateSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.revalidate(req), { code } = _c, rest = __rest(_c, ["code"]);
            res.status(code).json(rest);
        }));
        // flight revalidate version 2.0
        this.revalidatedFlightV2 = this.asyncWrapper.wrap({ bodySchema: this.validator.flightRevalidateSchemaV2 }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.flightRevalidateV2(req), { code } = _d, rest = __rest(_d, ["code"]);
            res.status(code).json(rest);
        }));
    }
}
exports.default = BookingFlightController;
