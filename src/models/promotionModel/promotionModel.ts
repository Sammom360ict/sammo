import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IArticleFilterQuery,
  ICreateArticlePayload,
  ISingleArticleParams,
  IUpdateArticlePayload,
} from "../../utils/interfaces/article/articleInterface";
import Schema from "../../utils/miscellaneous/schema";

class PromotionModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //insert promo code
  public async insertPromoCode(payload: any) {
    return await this.db("promo_codes")
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, "id");
  }

  //list of promo code
  public async getPromoCodeList({
    code,
    status,
    limit,
    skip,
  }: {
    code?: string;
    status?: string;
    limit?: number;
    skip?: number;
  }) {
    const data = await this.db("promo_codes")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "id",
        "code",
        "discount_percentage",
        "max_usage",
        "expiry_date",
        "status",
        "created_at"
      )
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

    const total = await this.db("promo_codes")
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
      total: parseInt(total[0].total as string),
    };
  }

  //single promo code
  public async getSinglePromoCode(id: number) {
    return await this.db("promo_codes")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "id",
        "code",
        "discount_percentage",
        "max_usage",
        "expiry_date",
        "status",
        "created_at"
      )
      .where({ id });
  }

  //update promo code
  public async updatePromoCode(payload: any, id: number) {
    return await this.db("promo_codes")
      .withSchema(this.ADMIN_SCHEMA)
      .update(payload)
      .where({ id });
  }

  //insert offer
  public async insertOffer(payload: any) {
    return await this.db("promotional_offers")
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, "id");
  }

  //list of offer
  public async getOfferList({
    status,
    limit,
    skip,
    name,
    slug,
  }: {
    status?: string;
    limit?: number;
    skip?: number;
    name?: string;
    slug?: string;
  }) {
    const data = await this.db("promotional_offers as po")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "po.id",
        "po.title",
        "po.description",
        "po.banner",
        "po.start_date",
        "po.end_date",
        "po.status",
        "po.slug",
        "po.promo_code_id",
        "pc.code",
        "po.created_at"
      )
      .leftJoin("promo_codes as pc", "po.promo_code_id", "pc.id")
      .where((qb) => {
        if (status) {
          qb.where("po.status", status);
        }

        if (name) {
          qb.andWhere("pc.code", "ilike", `%${name}%`).orWhere(
            "po.title",
            "ilike",
            `%${name}%`
          );
        }

        if (slug) {
          qb.where("po.slug", slug);
        }
      })
      .orderBy("po.created_at", "desc")
      .limit(limit || 100)
      .offset(skip || 0);

    const total = await this.db("promotional_offers as po")
      .withSchema(this.ADMIN_SCHEMA)
      .count("po.id as total")
      .where((qb) => {
        if (status) {
          qb.where("po.status", status);
        }
        if (name) {
          qb.andWhere("pc.code", "ilike", `%${name}%`).orWhere(
            "po.title",
            "ilike",
            `%${name}%`
          );
        }
        if (slug) {
          qb.where("po.slug", slug);
        }
      });

    return {
      data: data,
      total: parseInt(total[0].total as string),
    };
  }

  //get single offer
  public async getSingleOffer({ id, slug }: { id?: number; slug?: string }) {
    return await this.db("promotional_offers as po")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "po.id",
        "po.title",
        "po.description",
        "po.slug",
        "po.banner",
        "po.start_date",
        "po.end_date",
        "po.status",
        "po.promo_code_id",
        "pc.code",
        "po.created_at"
      )
      .leftJoin("promo_codes as pc", "po.promo_code_id", "pc.id")
      .where(function () {
        if (id) {
          this.where("po.id", id);
        }
        if (slug) {
          this.andWhere("slug", slug);
        }
      });
  }

  //update promo code
  public async updateOffer(payload: any, id: number) {
    return await this.db("promotional_offers")
      .withSchema(this.ADMIN_SCHEMA)
      .update(payload)
      .where({ id });
  }
}
export default PromotionModel;
