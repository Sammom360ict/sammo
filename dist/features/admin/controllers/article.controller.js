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
const article_service_1 = __importDefault(require("../services/article.service"));
const article_validator_1 = __importDefault(require("../utils/validators/article.validator"));
class AdminArticleController extends abstract_controller_1.default {
    constructor() {
        super();
        this.AdminArticleService = new article_service_1.default();
        this.ArticleValidator = new article_validator_1.default();
        //create article
        this.createArticle = this.asyncWrapper.wrap({ bodySchema: this.ArticleValidator.createArticlePayloadValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.AdminArticleService.createArticle(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //get article list
        this.getArticleList = this.asyncWrapper.wrap({ querySchema: this.ArticleValidator.articleListFilterQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.AdminArticleService.getArticleList(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //get single article
        this.getSingleArticle = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.AdminArticleService.getSingleArticle(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //update article
        this.updateArticle = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.ArticleValidator.updateArticlePayloadValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.AdminArticleService.updateArticle(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //delete article
        this.deleteArticle = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.AdminArticleService.deleteArticle(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //insert article
        this.insertArticleDoc = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = __rest(yield this.AdminArticleService.insertArticleDoc(req), []);
            res.status(200).json(data);
        }));
        //get all article doc
        this.getAllArticleDoc = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.AdminArticleService.getAllArticleDoc(req);
            res.status(200).json(data);
        }));
    }
}
exports.default = AdminArticleController;
