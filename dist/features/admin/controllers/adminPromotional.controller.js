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
exports.AdminPromotionalController = void 0;
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const admin_promotion_validator_1 = require("../utils/validators/admin.promotion.validator");
const adminPromotional_service_1 = require("../services/adminPromotional.service");
class AdminPromotionalController extends abstract_controller_1.default {
    constructor() {
        super();
        this.services = new adminPromotional_service_1.AdminPromotionalService();
        this.validator = new admin_promotion_validator_1.AdminPrmotionValidator();
        // insert promo code
        this.insertPromoCode = this.asyncWrapper.wrap({ bodySchema: this.validator.createPromoCodeValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.services.insertPromoCode(req), { code } = _a, rest = __rest(_a, ["code"]);
            res.status(code).json(rest);
        }));
        // get all promo code
        this.getAllPromoCode = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.services.getAllPromoCode(req), { code } = _b, rest = __rest(_b, ["code"]);
            res.status(code).json(rest);
        }));
        // update promo code
        this.updatePromoCode = this.asyncWrapper.wrap({
            bodySchema: this.validator.updatePromoCodeValidator,
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.services.updatePromoCode(req), { code } = _c, rest = __rest(_c, ["code"]);
            res.status(code).json(rest);
        }));
        // insert offer
        this.inserOffer = this.asyncWrapper.wrap({ bodySchema: this.validator.createOfferValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.services.inserOffer(req), { code } = _d, rest = __rest(_d, ["code"]);
            res.status(code).json(rest);
        }));
        // get all offer
        this.getAllOffer = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.services.getAlOffer(req), { code } = _e, rest = __rest(_e, ["code"]);
            res.status(code).json(rest);
        }));
        // get single offer
        this.getSingleOffer = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.services.getSingleOffer(req), { code } = _f, rest = __rest(_f, ["code"]);
            res.status(code).json(rest);
        }));
        // update offer
        this.updateOffer = this.asyncWrapper.wrap({
            bodySchema: this.validator.updateOfferValidator,
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.services.updateOffer(req), { code } = _g, rest = __rest(_g, ["code"]);
            res.status(code).json(rest);
        }));
    }
}
exports.AdminPromotionalController = AdminPromotionalController;
