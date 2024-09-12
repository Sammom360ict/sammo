import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IGetBookingRequestParams,
  IGetSingleBookingRequestParams,
  IInsertBookingRequestPayload,
  IInsertBookingRequestSegment,
  IInsertBookingRequestTravelerPayload,
} from "../../utils/interfaces/booking/bookingRequest.interface";
import Schema from "../../utils/miscellaneous/schema";
export class BtocBookingRequestModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }
  // insert booking request
  public async insert(payload: IInsertBookingRequestPayload) {
    return await this.db("booking_request")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload, "id");
  }
  // get booking request
  public async get(params: IGetBookingRequestParams, total: boolean = false) {
    const data = await this.db(`${this.BTOC_SCHEMA}.booking_request as fb`)
      .select(
        "fb.id as booking_id",
        "us.username as created_by",
        "fb.total_passenger",
        "fb.ticket_issue_last_time",
        "fb.status",
        "fb.payable_amount",
        "fb.discount",
        "fb.ticket_price",
        "fb.journey_type",
        "fb.created_at",
        this.db.raw(`
                    CONCAT(
                      DATE(MIN(brs.departure_date)),
                      ' ',
                      (SELECT fs_inner.departure_time
                       FROM ${this.BTOC_SCHEMA}.booking_request_segment fs_inner
                       WHERE fs_inner.booking_request_id = fb.id
                         AND fs_inner.departure_date = MIN(brs.departure_date)
                       LIMIT 1)
                    ) as flight_date
                  `),
        this.db.raw(`
                    CONCAT(
                      SUBSTRING(MIN(brs.origin) FROM POSITION(',' IN MIN(brs.origin)) + 1 FOR POSITION(')' IN MIN(brs.origin)) - POSITION(',' IN MIN(brs.origin)) - 1),
                      ' - ',
                      STRING_AGG(
                        SUBSTRING(brs.destination FROM POSITION(',' IN brs.destination) + 1 FOR POSITION(')' IN brs.destination) - POSITION(',' IN brs.destination) - 1),
                        ' - '
                        ORDER BY brs.departure_date ASC
                      )
                    ) as route
                  `)
      )
      .leftJoin(`${this.BTOC_SCHEMA}.users as us`, "us.id", "fb.created_by")
      .leftJoin(
        `${this.BTOC_SCHEMA}.booking_request_segment as brs`,
        "brs.booking_request_id",
        "fb.id"
      )
      .groupBy(
        "fb.id",
        "us.username",
        "fb.total_passenger",
        "fb.ticket_issue_last_time",
        "fb.status",
        "fb.payable_amount",
        "fb.discount",
        "fb.ticket_price",
        "fb.journey_type",
        "fb.created_at"
      )
      .where((qb) => {
        if (params.user_name) {
          qb.andWhereILike("us.username", `%${params.user_name}%`);
        }
        if (params.user_id) {
          qb.andWhere("us.id", params.user_id);
        }
        if (params.status) {
          qb.andWhere("fb.status", params.status);
        }
        if (params.from_date && params.to_date) {
          qb.andWhereBetween("fb.created_at", [
            params.from_date,
            params.to_date,
          ]);
        }
      })
      .limit(params.limit ? Number(params.limit) : 100)
      .offset(params.skip ? Number(params.skip) : 0)
      .orderBy("fb.id", "desc");
    let count: any[] = [];
    if (total) {
      count = await this.db(`${this.BTOC_SCHEMA}.booking_request as fb`)
        .count("fb.id as total")
        .leftJoin("btoc.users as us", "us.id", "fb.created_by")
        .where((qb) => {
          if (params.user_name) {
            qb.andWhereILike("us.username", `%${params.user_name}%`);
          }
          if (params.user_id) {
            qb.andWhere("us.id", params.user_id);
          }
          if (params.status) {
            qb.andWhere("fb.status", params.status);
          }
          if (params.from_date && params.to_date) {
            qb.andWhereBetween("fb.created_at", [
              params.from_date,
              params.to_date,
            ]);
          }
        });
    }
    return { data, total: count[0]?.total };
  }
  // get single
  public async getSingle(params: IGetSingleBookingRequestParams) {
    return await this.db(`${this.BTOC_SCHEMA}.booking_request as fb`)
      .select(
        "fb.id as booking_id",
        "us.username as created_by",
        "fb.total_passenger",
        "fb.ticket_issue_last_time",
        "fb.status",
        "fb.note",
        "fb.ticket_price",
        "fb.base_fare",
        "fb.total_tax",
        "fb.commission",
        "fb.payable_amount",
        "fb.ait",
        "fb.discount",
        "fb.journey_type",
        "fb.created_at"
      )
      .leftJoin("btoc.users as us", "us.id", "fb.created_by")
      .where((qb) => {
        if (params.id) {
          qb.andWhere("fb.id", params.id);
        }
        if (params.user_id) {
          qb.andWhere("fb.user_id", params.user_id);
        }
      });
  }
  // update
  public async update(
    payload: { status?: string; note?: string; updated_by?: number },
    id: number,
    user_id?: number
  ) {
    return await this.db("booking_request")
      .withSchema(this.BTOC_SCHEMA)
      .update(payload)
      .where((qb) => {
        qb.andWhere({ id });
        if (user_id) {
          qb.andWhere({ user_id });
        }
      });
  }
  // insert segment
  public async insertSegment(payload: IInsertBookingRequestSegment[]) {
    return await this.db("booking_request_segment")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload);
  }
  // get segment
  public async getSegment(booking_id: number) {
    return await this.db("booking_request_segment")
      .withSchema(this.BTOC_SCHEMA)
      .select("*")
      .where({ booking_request_id: booking_id });
  }
  // get booking request count
  public async getBookingRequestCount({
    from_date,
    status,
    to_date,
  }: {
    from_date: string;
    to_date: string;
    status?: string;
  }) {
    const total = await this.db("booking_request")
      .withSchema(this.BTOC_SCHEMA)
      .count("id AS total")
      .where((qb) => {
        qb.andWhereBetween("created_at", [from_date, to_date]);
        if (status) {
          qb.andWhere({ status });
        }
      });
    return total[0].total;
  }
  //insert traveler
  public async insertTraveler(payload: IInsertBookingRequestTravelerPayload[]) {
    return await this.db("booking_request_traveler")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload);
  }
  // get traveler
  public async getTraveler(booking_id: number) {
    return await this.db(`${this.BTOC_SCHEMA}.booking_request_traveler as tr`)
      .select("tr.*")
      .where({ booking_request_id: booking_id });
  }
}
