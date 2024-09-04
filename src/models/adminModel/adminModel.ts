import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IAdminSearchQuery,
  IAdminCreatePayload,
  IUpdateProfilePayload,
  IGetAdminListFilterQuery,
} from "../../utils/interfaces/admin/adminInterface";
import Schema from "../../utils/miscellaneous/schema";

class AdminModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //get single admin
  public async getSingleAdmin(payload: IAdminSearchQuery) {
    return await this.db("user_admin as ua")
      .select("ua.*", "rl.name as role", "rl.id as role_id")
      .withSchema(this.ADMIN_SCHEMA)
      .leftJoin("roles as rl", "rl.id", "ua.role_id")
      .where((qb) => {
        if (payload.id) {
          qb.where("ua.id", payload.id);
        }
        if (payload.email) {
          qb.orWhere("email", payload.email);
        }
        if (payload.phone_number) {
          qb.orWhere("phone_number", payload.phone_number);
        }
        if (payload.username) {
          qb.orWhere("username", payload.username);
        }
      });
  }

  //update user admin
  public async updateUserAdmin(
    payload: IUpdateProfilePayload,
    where: { id?: number; email?: string }
  ) {
    return await this.db("user_admin")
      .withSchema(this.ADMIN_SCHEMA)
      .update(payload)
      .where((qb) => {
        if (where.id) {
          qb.where("id", where.id);
        }
        if (where.email) {
          qb.where("email", where.email);
        }
      });
  }

  //create admin
  public async createAdmin(payload: IAdminCreatePayload) {
    return await this.db("user_admin")
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, "id");
  }

  //get all admin
  public async getAllAdmin(
    query: IGetAdminListFilterQuery,
    is_total: boolean = false
  ) {
    const data = await this.db("user_admin as ua")
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        "ua.id",
        "ua.username",
        "ua.email",
        "ua.phone_number",
        "ua.photo",
        "rl.name as role",
        "ua.status"
      )
      .leftJoin("roles as rl", "rl.id", "ua.role_id")
      .where((qb) => {
        if (query.filter) {
          qb.where((qbc) => {
            qbc.where("ua.username", "ilike", `%${query.filter}%`);
            qbc.orWhere("ua.email", "ilike", `%${query.filter}%`);
            qbc.orWhere("ua.phone_number", "ilike", `%${query.filter}%`);
          });
        }
        if (query.role) {
          qb.andWhere("rl.id", query.role);
        }
        if (query.status === "true" || query.status === "false") {
          qb.andWhere("ua.status", query.status);
        }
      })
      .orderBy("ua.id", "desc")
      .limit(query.limit ? query.limit : 100)
      .offset(query.skip ? query.skip : 0);

    let total: any[] = [];

    if (is_total) {
      total = await this.db("user_admin as ua")
        .withSchema(this.ADMIN_SCHEMA)
        .count("ua.id as total")
        .join("roles as rl", "rl.id", "ua.role_id")
        .where((qb) => {
          if (query.filter) {
            qb.where((qbc) => {
              qbc.where("ua.username", "ilike", `%${query.filter}%`);
              qbc.orWhere("ua.email", "ilike", `%${query.filter}%`);
              qbc.orWhere("ua.phone_number", "ilike", `%${query.filter}%`);
            });
          }
          if (query.role) {
            qb.andWhere("rl.id", query.role);
          }
          if (query.status === "true" || query.status === "false") {
            qb.andWhere("ua.status", query.status);
          }
        });
    }

    return {
      data: data,
      total: total[0]?.total,
    };
  }

  //get last  admin Id
  public async getLastAdminID() {
    const data = await this.db("user_admin")
      .withSchema(this.ADMIN_SCHEMA)
      .select("id")
      .orderBy("id", "desc")
      .limit(1);

    return data.length ? data[0].id : 1;
  }

  //dashboard
  public async adminDashboard() {
    const total_booking = await this.db("flight_booking")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        this.db.raw(`
              COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'pending') AS total_pending,
              COUNT(*) FILTER (WHERE status = 'cancelled') AS total_cancelled,
              COUNT(*) FILTER (WHERE status = 'issued') AS total_issued,
              COUNT(*) FILTER (WHERE status = 'paid') AS total_paid_but_not_issued
              `)
      )
      .first();

    const total_booking_b2b = await this.db("flight_booking")
      .withSchema(this.BTOB_SCHEMA)
      .select(
        this.db.raw(`
              COUNT(*) AS total_b2b,
              COUNT(*) FILTER (WHERE status = 'pending') AS b2b_total_pending,
              COUNT(*) FILTER (WHERE status = 'cancelled') AS b2b_total_cancelled,
              COUNT(*) FILTER (WHERE status = 'issued') AS b2b_total_issued
              `)
      )
      .first();
    const currentYear = new Date().getFullYear();

    const booking_graph = await this.db("flight_booking")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        this.db.raw(`
          TRIM(TO_CHAR(created_at, 'Month')) AS month_name,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'pending') AS total_pending,
          COUNT(*) FILTER (WHERE status = 'cancelled') AS total_cancelled,
          COUNT(*) FILTER (WHERE status = 'issued') AS total_issued,
          COUNT(*) FILTER (WHERE status = 'paid') AS total_paid_but_not_issued
      `)
      )
      .whereRaw(`EXTRACT(YEAR FROM created_at) = ${currentYear}`)
      .groupByRaw("TRIM(TO_CHAR(created_at, 'Month'))")
      .orderByRaw("MIN(created_at)");

    const booking_graph_b2b = await this.db("flight_booking")
      .withSchema(this.BTOB_SCHEMA)
      .select(
        this.db.raw(`
          TRIM(TO_CHAR(created_at, 'Month')) AS month_name,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'pending') AS total_pending,
          COUNT(*) FILTER (WHERE status = 'cancelled') AS total_cancelled,
          COUNT(*) FILTER (WHERE status = 'issued') AS total_issued,
          COUNT(*) FILTER (WHERE status = 'paid') AS total_paid_but_not_issued
      `)
      )
      .whereRaw(`EXTRACT(YEAR FROM created_at) = ${currentYear}`)
      .groupByRaw("TRIM(TO_CHAR(created_at, 'Month'))")
      .orderByRaw("MIN(created_at)");

    return {
      total_booking: { ...total_booking, ...total_booking_b2b },
      booking_graph,
      booking_graph_b2b,
    };
  }
}
export default AdminModel;
