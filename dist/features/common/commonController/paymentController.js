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
const paymentService_1 = __importDefault(require("../commonService/paymentService"));
class PaymentController extends abstract_controller_1.default {
    constructor() {
        super();
        this.PaymentService = new paymentService_1.default();
        //payment failed
        this.paymentFailed = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.PaymentService.paymentFailed(req), { code } = _a, rest = __rest(_a, ["code"]);
            if (rest.redirect_url) {
                console.log(rest.redirect_url);
                res.status(code).redirect(rest.redirect_url);
            }
            else {
                console.log({ rest });
                res.status(code).json(rest);
            }
        }));
        //payment success
        this.paymentSuccess = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.PaymentService.paymentSuccess(req), { code } = _b, rest = __rest(_b, ["code"]);
            if (rest.redirect_url) {
                res.status(code).redirect(rest.redirect_url);
            }
            else {
                res.status(code).json(rest);
            }
        }));
        //payment cancelled
        this.paymentCancelled = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.PaymentService.paymentCancelled(req), { code } = _c, rest = __rest(_c, ["code"]);
            if (rest.redirect_url) {
                res.status(code).redirect(rest.redirect_url);
            }
            else {
                res.status(code).json(rest);
            }
        }));
    }
}
exports.default = PaymentController;
