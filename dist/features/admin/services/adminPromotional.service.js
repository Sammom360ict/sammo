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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPromotionalService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const uuid_1 = require("uuid");
class AdminPromotionalService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // insert promo code
    insertPromoCode(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.promotionModel();
            const { data: checkCode } = yield model.getPromoCodeList({
                code: req.body.code,
            });
            if (checkCode.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.HTTP_CONFLICT,
                };
            }
            yield model.insertPromoCode(Object.assign(Object.assign({}, req.body), { created_by: id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    //get promo code list
    getAllPromoCode(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status, code } = req.query;
            const data = yield this.Model.promotionModel().getPromoCodeList({
                limit: Number(limit),
                skip: Number(skip),
                status: status,
                code: code,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //update promo code
    updatePromoCode(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const model = this.Model.promotionModel();
            if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.code) {
                const { data: checkCode } = yield model.getPromoCodeList({
                    code: req.body.code,
                });
                if (checkCode.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Promo code already exist",
                    };
                }
            }
            yield model.updatePromoCode(Object.assign({}, req.body), parseInt(req.params.id));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // insert offer
    inserOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.promotionModel();
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            req.body.slug =
                req.body.title
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]/g, "") +
                    "-" +
                    (0, uuid_1.v4)();
            // check if this slug already exists
            const { data: check_slug } = yield model.getOfferList({
                slug: req.body.slug,
            });
            if (check_slug.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.SLUG_EXISTS,
                };
            }
            if (req.body.promo_code_id) {
                const checkCode = yield model.getSinglePromoCode(parseInt(req.body.promo_code_id));
                if (!checkCode.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
            }
            yield model.insertOffer(Object.assign(Object.assign({}, req.body), { created_by: id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    //get all offer
    getAlOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status, name } = req.query;
            const data = yield this.Model.promotionModel().getOfferList({
                limit: Number(limit),
                skip: Number(skip),
                status: status,
                name: name,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get single offer
    getSingleOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.Model.promotionModel().getSingleOffer({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    //update offer
    updateOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.promotionModel();
            const files = req.files || [];
            if (files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            if (req.body.title) {
                req.body.slug =
                    req.body.title
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/[^\w-]/g, "") +
                        "-" +
                        (0, uuid_1.v4)();
            }
            yield model.updateOffer(Object.assign({}, req.body), parseInt(req.params.id));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
}
exports.AdminPromotionalService = AdminPromotionalService;
