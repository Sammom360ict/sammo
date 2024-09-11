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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class PromotionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //insert promo code
    insertPromoCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("promo_codes")
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, "id");
        });
    }
    //list of promo code
    getPromoCodeList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, status, limit, skip, }) {
            const data = yield this.db("promo_codes")
                .withSchema(this.ADMIN_SCHEMA)
                .select("id", "code", "discount_percentage", "max_usage", "expiry_date", "status", "created_at")
                .where((qb) => {
                if (status) {
                    qb.where("status", status);
                }
                if (code) {
                    qb.where("code", "ilike", `%${code}%`);
                }
            })
                .orderBy("created_at", "desc")
                .limit(limit || 100)
                .offset(skip || 0);
            const total = yield this.db("promo_codes")
                .withSchema(this.ADMIN_SCHEMA)
                .count("id as total")
                .where((qb) => {
                if (status) {
                    qb.where("status", status);
                }
                if (code) {
                    qb.where("code", "ilike", `%${code}%`);
                }
            });
            return {
                data: data,
                total: parseInt(total[0].total),
            };
        });
    }
    //single promo code
    getSinglePromoCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("promo_codes")
                .withSchema(this.ADMIN_SCHEMA)
                .select("id", "code", "discount_percentage", "max_usage", "expiry_date", "status", "created_at")
                .where({ id });
        });
    }
    //update promo code
    updatePromoCode(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("promo_codes")
                .withSchema(this.ADMIN_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    //insert offer
    insertOffer(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("promotional_offers")
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, "id");
        });
    }
    //list of offer
    getOfferList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ status, limit, skip, name, slug, }) {
            const data = yield this.db("promotional_offers as po")
                .withSchema(this.ADMIN_SCHEMA)
                .select("po.id", "po.title", "po.description", "po.banner", "po.start_date", "po.end_date", "po.status", "po.slug", "po.promo_code_id", "pc.code", "po.created_at")
                .leftJoin("promo_codes as pc", "po.promo_code_id", "pc.id")
                .where((qb) => {
                if (status) {
                    qb.where("po.status", status);
                }
                if (name) {
                    qb.andWhere("pc.code", "ilike", `%${name}%`).orWhere("po.title", "ilike", `%${name}%`);
                }
                if (slug) {
                    qb.where("po.slug", slug);
                }
            })
                .orderBy("po.created_at", "desc")
                .limit(limit || 100)
                .offset(skip || 0);
            const total = yield this.db("promotional_offers as po")
                .withSchema(this.ADMIN_SCHEMA)
                .count("po.id as total")
                .where((qb) => {
                if (status) {
                    qb.where("po.status", status);
                }
                if (name) {
                    qb.andWhere("pc.code", "ilike", `%${name}%`).orWhere("po.title", "ilike", `%${name}%`);
                }
                if (slug) {
                    qb.where("po.slug", slug);
                }
            });
            return {
                data: data,
                total: parseInt(total[0].total),
            };
        });
    }
    //get single offer
    getSingleOffer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, slug }) {
            return yield this.db("promotional_offers as po")
                .withSchema(this.ADMIN_SCHEMA)
                .select("po.id", "po.title", "po.description", "po.slug", "po.banner", "po.start_date", "po.end_date", "po.status", "po.promo_code_id", "pc.code", "po.created_at")
                .leftJoin("promo_codes as pc", "po.promo_code_id", "pc.id")
                .where(function () {
                if (id) {
                    this.where("po.id", id);
                }
                if (slug) {
                    this.andWhere("slug", slug);
                }
            });
        });
    }
    //update promo code
    updateOffer(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("promotional_offers")
                .withSchema(this.ADMIN_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
}
exports.default = PromotionModel;
