import AbstractServices from "../../../abstract/abstract.service";
import { Request } from "express";
import { IArticleFilterQuery } from "../../../utils/interfaces/article/articleInterface";

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
    const check_slug = await model.getSingleArticle(
      { slug: req.body.slug },
      false
    );

    console.log({ check_slug });
    if (check_slug.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.SLUG_EXISTS,
      };
    }

    await model.createArticle({
      ...req.body,
      created_by: req.admin.id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: req.body,
    };
  }

  //get article list
  public async getArticleList(req: Request) {
    const { title, status, limit, skip, deleted } =
      req.query as IArticleFilterQuery;

    const data = await this.Model.articleModel().getArticleList({
      title,
      status,
      limit,
      skip,
      deleted,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single article
  public async getSingleArticle(req: Request) {
    const article_id = req.params.id;

    const data = await this.Model.articleModel().getSingleArticle({
      id: Number(article_id),
    });

    if (!data.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: data[0],
    };
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
      const check_slug = await model.getSingleArticle(
        { slug: req.body.slug },
        true,
        Number(article_id)
      );
      if (check_slug.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: this.ResMsg.SLUG_EXISTS,
        };
      }
    }

    const update_article = await model.updateArticle(
      req.body,
      Number(article_id)
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: req.body,
    };
  }

  public async deleteArticle(req: Request) {
    const article_id = req.params.id;
    const model = this.Model.articleModel();
    const check_article = await model.getSingleArticle(
      { id: Number(article_id) },
      false
    );
    if (!check_article.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const delete_article = await model.updateArticle(
      { deleted: true },
      Number(article_id)
    );
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

  //-------------------- insert article doc -------------------//

  //create article
  public async insertArticleDoc(req: Request) {
    const files = (req.files as Express.Multer.File[]) || [];

    const uploadedFiles: string[] = [];

    console.log({ files });

    const payload: any = {};

    if (files?.length) {
      for (const element of files) {
        payload["link"] = element.filename;
        uploadedFiles.push(element.filename);
      }

      // console.log(req.body, "body");

      console.log({ payload });

      await this.Model.articleModel().insertArticleDoc(payload);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: uploadedFiles,
    };
  }

  //get all article doc
  public async getAllArticleDoc(req: Request) {
    const { limit, skip, status } = req.query;

    const { data, total } = await this.Model.articleModel().getAllArticleDoc({
      limit: parseInt(limit as string),
      skip: parseInt(skip as string),
      status: status as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total,
      data,
    };
  }
}

export default AdminArticleService;
