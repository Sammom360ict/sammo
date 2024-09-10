import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import AdminArticleService from "../services/article.service";
import ArticleValidator from "../utils/validators/article.validator";

class AdminArticleController extends AbstractController {
  private AdminArticleService = new AdminArticleService();
  private ArticleValidator = new ArticleValidator();

  constructor() {
    super();
  }

  //create article
  public createArticle = this.asyncWrapper.wrap(
    { bodySchema: this.ArticleValidator.createArticlePayloadValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdminArticleService.createArticle(
        req
      );
      res.status(code).json(data);
    }
  );

  //get article list
  public getArticleList = this.asyncWrapper.wrap(
    { querySchema: this.ArticleValidator.articleListFilterQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdminArticleService.getArticleList(
        req
      );
      res.status(code).json(data);
    }
  );

  //get single article
  public getSingleArticle = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdminArticleService.getSingleArticle(
        req
      );
      res.status(code).json(data);
    }
  );

  //update article
  public updateArticle = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
      bodySchema: this.ArticleValidator.updateArticlePayloadValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdminArticleService.updateArticle(
        req
      );
      res.status(code).json(data);
    }
  );

  //delete article
  public deleteArticle = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdminArticleService.deleteArticle(
        req
      );
      res.status(code).json(data);
    }
  );

  //insert article
  public insertArticleDoc = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { ...data } = await this.AdminArticleService.insertArticleDoc(req);
      res.status(200).json(data);
    }
  );

  //get all article doc
  public getAllArticleDoc = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const data = await this.AdminArticleService.getAllArticleDoc(req);
      res.status(200).json(data);
    }
  );
}

export default AdminArticleController;
