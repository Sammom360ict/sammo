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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class AdminArticleService extends abstract_service_1.default {
    //create article
    createArticle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            req.body.slug = req.body.title.toLowerCase().replace(/ /g, "-");
            const model = this.Model.articleModel();
            //check if this slug already exists
            const check_slug = yield model.getSingleArticle({ slug: req.body.slug }, false);
            if (check_slug.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.SLUG_EXISTS,
                };
            }
            const create_article = yield model.createArticle(req.body);
            if (create_article) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }
        });
    }
    //get article list
    getArticleList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, status, limit, skip } = req.query;
            const model = this.Model.articleModel();
            const data = yield model.getArticleList({ title, status, limit, skip });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data
            };
        });
    }
    //get single article
    getSingleArticle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const article_id = req.params.id;
            const model = this.Model.articleModel();
            const data = yield model.getSingleArticle({ id: Number(article_id) }, false);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: data[0],
            };
        });
    }
    //update article
    updateArticle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const article_id = req.params.id;
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const model = this.Model.articleModel();
            if (req.body.title) {
                req.body.slug = req.body.title.toLowerCase().replace(/ /g, "-");
                //check if this slug already exists
                const check_slug = yield model.getSingleArticle({ slug: req.body.slug }, false, Number(article_id));
                if (check_slug.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.SLUG_EXISTS,
                    };
                }
            }
            const update_article = yield model.updateArticle(req.body, Number(article_id));
            if (update_article) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: req.body
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }
        });
    }
    deleteArticle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const article_id = req.params.id;
            const model = this.Model.articleModel();
            const check_article = yield model.getSingleArticle({ id: Number(article_id) }, false);
            if (!check_article.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const delete_article = yield model.updateArticle({ deleted: true }, Number(article_id));
            if (delete_article) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }
        });
    }
}
exports.default = AdminArticleService;
