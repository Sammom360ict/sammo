import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IGetBookingRequestParams,
  IGetSingleBookingRequestParams,
  IInsertBookingRequestPayload,
  IInsertBookingRequestSegment,
  IInsertBookingRequestTravelerPayload,
} from "../../utils/interfaces/booking/bookingRequest.interface";
import Schema from "../../utils/miscellaneous/schema";

export class BookingRequestModel extends Schema {
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
    const data = await this.db("booking.booking_request AS bbr")
      .select(
        "bbr.id",
        "bbr.status",
        "bbr.journey_type",
        "bbr.created_date",
        "bbr.payable",
        "bbr.note",
        "us.id AS user_id",
        "us.username",
        "us.photo AS user_photo",
        "us.phone_number",
        "bbr.origin",
        "bbr.destination",
        this.db.raw(`
            json_agg(
                json_build_object(
                    'origin', brs.origin,
                    'destination', brs.destination,
                    'class', brs.class,
                    'airline', brs.airline,
                    'airline_logo', brs.airline_logo,
                    'departure_time', brs.departure_time,
                    'departure_date', brs.departure_date
                )
            ) AS segments
        `)
      )
      .join("user.users as us", "us.id", "bbr.user_id")
      .leftJoin(
        "booking.booking_request_segment as brs",
        "bbr.id",
        "brs.booking_request_id"
      )
      .where((qb) => {
        if (params.user_name) {
          qb.andWhereILike("us.username", `%${params.user_name}%`);
        }
        if (params.user_id) {
          qb.andWhere("us.id", params.user_id);
        }
        if (params.status) {
          qb.andWhere("bbr.status", params.status);
        }
        if (params.from_date && params.to_date) {
          qb.andWhereBetween("bbr.created_date", [
            params.from_date,
            params.to_date,
          ]);
        }
      })
      .groupBy(
        "bbr.id",
        "bbr.status",
        "bbr.journey_type",
        "bbr.created_date",
        "bbr.payable",
        "bbr.note",
        "us.id",
        "us.username",
        "us.photo",
        "us.phone_number",
        "bbr.origin",
        "bbr.destination"
      )
      .limit(params.limit ? Number(params.limit) : 100)
      .offset(params.skip ? Number(params.skip) : 0)
      .orderBy("bbr.id", "desc");

    let count: any[] = [];
    if (total) {
      count = await this.db("booking.booking_request AS bbr")
        .count("bbr.id as total")
        .join("user.users as us", "us.id", "bbr.user_id")
        .where((qb) => {
          if (params.user_name) {
            qb.andWhereILike("us.username", `%${params.user_name}%`);
          }
          if (params.user_id) {
            qb.andWhere("us.id", params.user_id);
          }
          if (params.status) {
            qb.andWhere("bbr.status", params.status);
          }
          if (params.from_date && params.to_date) {
            qb.andWhereBetween("bbr.created_date", [
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
    return await this.db("booking.booking_request AS bbr")
      .select(
        "bbr.id",
        "bbr.status",
        "bbr.journey_type",
        "bbr.ait",
        "bbr.created_date",
        "bbr.note",
        "bbr.commission",
        "bbr.total_price",
        "bbr.base_fair",
        "bbr.total_tax",
        "bbr.discount",
        "bbr.payable",
        "bbr.total_travelers",
        "bbr.traveler_adult",
        "bbr.traveler_children",
        "bbr.traveler_kids",
        "bbr.traveler_infants",
        "bu.id AS user_id",
        "bu.username AS username",
        "bu.photo AS user_photo",
        "bu.email AS user_email",
        "bu.phone_number AS user_phone",
        "ad.id AS admin_id",
        "ad.username AS admin_name",
        "ad.photo AS admin_photo"
      )
      .leftJoin("user.users AS bu", "bbr.user_id", "bu.id")
      .leftJoin("admin.user_admin AS ad", "bbr.updated_by", "ad.id")
      .where((qb) => {
        if (params.id) {
          qb.andWhere("bbr.id", params.id);
        }
        if (params.user_id) {
          qb.andWhere("bbr.user_id", params.user_id);
        }
      });
  }

  // update
  public async update(
    payload: { status: string; note: string; updated_by?: number },
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
    return await this.db("booking.booking_request_traveler as tr")
      .select("tr.*", "ci.name as city_name")
      .join("dbo.city as ci", "ci.id", "tr.city_id")
      .where({ booking_request_id: booking_id });
  }
}
