import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import Schema from "../../utils/miscellaneous/schema";

export class AuditTrailModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }
  //create btob audit
  public async createBtoBAudit(payload: {
    agency_id: number;
    created_by: number;
    type: string;
    details: string;
  }) {
    return await this.db("btob_audit_trail").insert(payload);
  }
  //get btob audit
  public async getBtoBAudit(payload: {
    agency_id: number;
    type?: string;
    limit?: number;
    skip?: number;
    from_date?: string;
    to_date?: string;
  }) {
    const data = await this.db("btob_audit_trail as at")
      .select(
        "at.id",
        "bu.name as created_by",
        "at.type",
        "at.details",
        "at.created_at"
      )
      .leftJoin("btob_user as bu", "bu.id", "at.created_by")
      .where("at.agency_id", payload.agency_id)
      .andWhere((qb) => {
        if (payload.type) {
          qb.andWhere("at.type", payload.type);
        }
        if (payload.from_date && payload.to_date) {
          qb.andWhereBetween("at.created_at", [
            payload.from_date,
            payload.to_date,
          ]);
        }
      })
      .limit(payload.limit || 100)
      .offset(payload.skip || 0)
      .orderBy("at.id", "desc");

    const total = await this.db("btob_audit_trail as at")
      .count("at.id as total")
      .leftJoin("btob_user as bu", "bu.id", "at.created_by")
      .where("at.agency_id", payload.agency_id)
      .andWhere((qb) => {
        if (payload.type) {
          qb.andWhere("at.type", payload.type);
        }
        if (payload.from_date && payload.to_date) {
          qb.andWhereBetween("at.created_at", [
            payload.from_date,
            payload.to_date,
          ]);
        }
      });
    return {
      data,
      total: total[0]?.total,
    };
  }
}
