import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IGetTravelerQuery,
  IInsertTravelerPayload,
  IUpdateTravelerPayload,
} from "../../utils/interfaces/user/travelerInterface";
import { DATA_LIMIT } from "../../utils/miscellaneous/constants";
import Schema from "../../utils/miscellaneous/schema";

export default class TravelerModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // insert traveler model
  public async insertTraveler(payload: IInsertTravelerPayload) {
    return await this.db("traveler")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload);
  }

  // get traveler model
  public async getTraveler(query: IGetTravelerQuery, total: boolean = false) {
    const data = await this.db("traveler as tr")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        "tr.id",
        "tr.title as reference",
        "tr.first_name as mid_name",
        "tr.sur_name as sur_name",
        "tr.mobile_number as phone",
        "tr.type",
        "tr.date_of_birth",
        "tr.email",
        "tr.city",
        "tr.passport_number",
        "tr.passport_expiry_date as passport_expire_date",
        "tr.frequent_flyer_number",
        "tr.frequent_flyer_airline",
        "con.name as country",
        "con.id as country_id",
        "tr.gender",
        "tr.status"
      )
      .joinRaw("left Join dbo.country as con on con.id = tr.country_id")
      .where((qb) => {
        qb.andWhere("tr.deleted", query.deleted);
        if (query.user_id) {
          qb.andWhere("tr.user_id", query.user_id);
        }
        if (query.name) {
          qb.andWhereRaw(
            "LOWER(tr.title || ' ' || tr.first_name || ' ' || tr.sur_name) LIKE LOWER(?)",
            [`%${query.name.toLocaleLowerCase()}%`]
          );
        }
        if (query.status !== undefined) {
          qb.andWhere("tr.status", query.status);
        }
      })
      .limit(query.limit ? Number(query.limit) : DATA_LIMIT)
      .offset(query.skip ? Number(query.skip) : 0)
      .orderBy("tr.create_date", "desc");

    let count: any[] = [];

    if (total) {
      count = await this.db("traveler")
        .withSchema(this.BTOC_SCHEMA)
        .count("id AS total")
        .where((qb) => {
          qb.andWhere("deleted", query.deleted);
          if (query.user_id) {
            qb.andWhere("user_id", query.user_id);
          }
          if (query.name) {
            qb.andWhereRaw(
              "LOWER(title || ' ' || first_name || ' ' || sur_name) LIKE LOWER(?)",
              [`%${query.name.toLocaleLowerCase()}%`]
            );
          }
          if (query.status !== undefined) {
            qb.andWhere("status", query.status);
          }
        });
    }

    return {
      data,
      total: parseInt(count[0]?.total),
    };
  }

  // get single traveler model
  public async getSingleTraveler(query: {
    id: number;
    user_id: number;
    deleted?: boolean;
  }) {
    return await this.db("traveler AS tr")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        "tr.id",
        "tr.title as reference",
        "tr.first_name as mid_name",
        "tr.sur_name as sur_name",
        "tr.mobile_number as phone",
        "tr.date_of_birth",
        "tr.gender",
        "tr.email",
        "tr.type",
        // 'tr.address',
        "tr.city",
        "tr.country_id",
        "con.name as country",
        "tr.passport_number",
        "tr.passport_expiry_date as passport_expire_date",
        "tr.frequent_flyer_number",
        "tr.frequent_flyer_airline",
        "tr.create_date"
      )

      .joinRaw("left Join dbo.country as con on con.id = tr.country_id")
      .where((qb) => {
        qb.andWhere("tr.id", query.id);
        qb.andWhere("tr.user_id", query.user_id);
        if (query.deleted !== undefined) {
          qb.andWhere("tr.deleted", query.deleted);
        }
      });
  }

  // update traveler model
  public async updateTraveler(payload: IUpdateTravelerPayload, id: number) {
    await this.db("traveler")
      .withSchema(this.BTOC_SCHEMA)
      .update(payload)
      .where("id", id);
  }

  // delete traveler model
  public async deleteTraveler(id: number) {
    await this.db("traveler")
      .withSchema(this.BTOC_SCHEMA)
      .delete()
      .where({ id });
  }
}
