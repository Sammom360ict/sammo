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
class ArticleModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //create article
    createArticle(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("article")
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, "id");
        });
    }
    //list of articles
    getArticleList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(params);
            const data = yield this.db("article")
                .withSchema(this.ADMIN_SCHEMA)
                .select("id", "title", "slug", "thumbnail", "thumbnail_details", "status", "deleted", "created_at")
                .where((qb) => {
                if (params.status) {
                    qb.where("status", params.status);
                }
                if (params.title) {
                    qb.andWhere((subQb) => {
                        subQb.where("title", "ilike", `%${params.title}%`);
                        subQb.orWhere("slug", "ilike", `%${params.title}%`);
                    });
                }
                if (params.deleted) {
                    qb.andWhere("deleted", params.deleted);
                }
            })
                .orderBy("created_at", "desc")
                .limit(params.limit ? params.limit : 100)
                .offset(params.skip ? params.skip : 0);
            const total = yield this.db("article")
                .withSchema(this.ADMIN_SCHEMA)
                .count("id as total")
                .where((qb) => {
                if (params.status) {
                    qb.where("status", params.status);
                }
                if (params.title) {
                    qb.andWhere((subQb) => {
                        subQb.where("title", "ilike", `%${params.title}%`);
                        subQb.orWhere("slug", "ilike", `%${params.title}%`);
                    });
                }
                if (params.deleted) {
                    qb.andWhere("deleted", params.deleted);
                }
            });
            return {
                data: data,
                total: total[0].total,
            };
        });
    }
    //get single article
    getSingleArticle(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, status = true, article_id, deleted) {
            return yield this.db("article")
                .withSchema(this.ADMIN_SCHEMA)
                .select("id", "title", "slug", "description", "thumbnail", "deleted", "thumbnail_details", "status", "created_at")
                .where((qb) => {
                if (params.id) {
                    qb.andWhere("id", params.id);
                }
                if (params.slug) {
                    qb.andWhere("slug", params.slug);
                }
                if (status) {
                    qb.andWhere("status", status);
                }
                if (article_id) {
                    qb.andWhereNot("id", article_id);
                }
            });
        });
    }
    //update article
    updateArticle(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("article")
                .withSchema(this.ADMIN_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    //create article
    insertArticleDoc(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("article_doc")
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, "link");
        });
    }
    //list of articles doc
    getAllArticleDoc(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit, skip, status, }) {
            const data = yield this.db("article_doc")
                .withSchema(this.ADMIN_SCHEMA)
                .select("id", "link", "status")
                .where((qb) => {
                if (status) {
                    qb.where("status", status);
                }
            })
                .orderBy("created_at", "desc")
                .limit(limit || 100)
                .offset(skip || 0);
            const total = yield this.db("article")
                .withSchema(this.DBO_SCHEMA)
                .count("id as total")
                .where((qb) => {
                if (status) {
                    qb.where("status", status);
                }
            });
            return {
                data: data,
                total: total[0].total,
            };
        });
    }
}
exports.default = ArticleModel;
