"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
class AdminArticleRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.AdminArticleController = new article_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create article, view list of articles
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES), this.AdminArticleController.createArticle)
            .get(this.AdminArticleController.getArticleList);
        // ------------- article doc start ----------------- //
        //create article, view list of articles
        this.router
            .route("/doc")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES), this.AdminArticleController.insertArticleDoc);
        this.router
            .route("/docs")
            .get(this.AdminArticleController.getAllArticleDoc);
        // ------------- article doc end ----------------- //
        //get single article, update, delete
        this.router
            .route("/:id")
            .get(this.AdminArticleController.getSingleArticle)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES), this.AdminArticleController.updateArticle)
            .delete(this.AdminArticleController.deleteArticle);
    }
}
exports.default = AdminArticleRouter;
