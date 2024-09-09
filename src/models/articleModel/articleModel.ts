import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IArticleFilterQuery,
  ICreateArticlePayload,
  ISingleArticleParams,
  IUpdateArticlePayload,
} from "../../utils/interfaces/article/articleInterface";
import Schema from "../../utils/miscellaneous/schema";

class ArticleModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //create article
  public async createArticle(payload: ICreateArticlePayload) {
    return await this.db("article")
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, "id");
  }

  //list of articles
  public async getArticleList(params: IArticleFilterQuery) {
    console.log(params);
    const data = await this.db("article")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "id",
        "title",
        "slug",
        "thumbnail",
        "thumbnail_details",
        "status",
        "deleted",
        "created_at"
      )
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

    const total = await this.db("article")
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
  }

  //get single article
  public async getSingleArticle(
    params: ISingleArticleParams,
    status: boolean = true,
    article_id?: number,
    deleted?: string
  ) {
    return await this.db("article")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "id",
        "title",
        "slug",
        "description",
        "thumbnail",
        "deleted",
        "thumbnail_details",
        "status",
        "created_at"
      )
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
  }

  //update article
  public async updateArticle(payload: IUpdateArticlePayload, id: number) {
    return await this.db("article")
      .withSchema(this.ADMIN_SCHEMA)
      .update(payload)
      .where({ id });
  }

  //create article
  public async insertArticleDoc(payload: ICreateArticlePayload) {
    return await this.db("article_doc")
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, "link");
  }

  //list of articles doc
  public async getAllArticleDoc({
    limit,
    skip,
    status,
  }: {
    limit: number;
    skip: number;
    status: string;
  }) {
    const data = await this.db("article_doc")
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

    const total = await this.db("article")
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
  }
}
export default ArticleModel;
