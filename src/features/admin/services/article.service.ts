import AbstractServices from '../../../abstract/abstract.service';
import { Request } from 'express';
import { IArticleFilterQuery } from '../../../utils/interfaces/article/articleInterface';

class AdminArticleService extends AbstractServices {

    //create article
    public async createArticle(req: Request) {
        const files = (req.files as Express.Multer.File[]) || [];
        if (files?.length) {
            req.body[files[0].fieldname] = files[0].filename;
        }
        req.body.slug = req.body.title.toLowerCase().replace(/ /g, "-");
        const model = this.Model.articleModel();
        //check if this slug already exists
        const check_slug = await model.getSingleArticle({ slug: req.body.slug }, false);
        if (check_slug.length) {
            return {
                success: false,
                code: this.StatusCode.HTTP_CONFLICT,
                message: this.ResMsg.SLUG_EXISTS,
            }
        }
        const create_article = await model.createArticle(req.body);
        if (create_article) {
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: req.body
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
            };
        }
    }

    //get article list
    public async getArticleList(req: Request) {
        const { title, status, limit, skip } = req.query as IArticleFilterQuery;
        const model = this.Model.articleModel();
        const data = await model.getArticleList({ title, status, limit, skip });
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: this.ResMsg.HTTP_OK,
            total: data.total,
            data: data.data
        }
    }

    //get single article
    public async getSingleArticle(req: Request) {
        const article_id = req.params.id;
        const model = this.Model.articleModel();
        const data = await model.getSingleArticle({ id: Number(article_id) }, false);
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: this.ResMsg.HTTP_OK,
            data: data[0],
        }
    }

    //update article
    public async updateArticle(req: Request) {
        const article_id = req.params.id;
        const files = (req.files as Express.Multer.File[]) || [];
        if (files?.length) {
            req.body[files[0].fieldname] = files[0].filename;
        }
        const model = this.Model.articleModel();
        if (req.body.title) {
            req.body.slug = req.body.title.toLowerCase().replace(/ /g, "-");
            //check if this slug already exists
            const check_slug = await model.getSingleArticle({ slug: req.body.slug }, false, Number(article_id));
            if (check_slug.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.SLUG_EXISTS,
                }
            }
        }

        const update_article = await model.updateArticle(req.body, Number(article_id));
        if (update_article) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: req.body
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
            };
        }
    }

    public async deleteArticle(req: Request) {
        const article_id = req.params.id;
        const model = this.Model.articleModel();
        const check_article = await model.getSingleArticle({ id: Number(article_id) }, false);
        if(!check_article.length){
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: this.ResMsg.HTTP_NOT_FOUND,
            }
        }
        const delete_article = await model.updateArticle({ deleted: true }, Number(article_id));
        if (delete_article) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
            };
        }
    }
}

export default AdminArticleService;
