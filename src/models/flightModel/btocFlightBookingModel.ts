import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  ICreateFlightBookingPayload,
  IInsertFlightSegmentPayload,
  IInsertFlightTravelerPayload,
} from "../../utils/interfaces/flight/flightBookingInterface";
import Schema from "../../utils/miscellaneous/schema";

class FlightBookingModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // get all flight booking
  public async getAllFlightBooking(payload: {
    limit?: string;
    skip?: string;
    user_id?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
    filter?: string;
  }) {
    const { limit, skip, status, user_id, from_date, to_date, filter } =
      payload;

    const data = await this.db("flight_booking as fb")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        "fb.id as booking_id",
        "us.username",
        "fb.pnr_code",
        "fb.total_passenger",
        "fb.ticket_issue_last_time",
        "fb.status",
        "fb.payable_amount",
        "fb.discount",
        "fb.ticket_price",
        "fb.journey_type",
        "fb.created_at"
      )
      .leftJoin("users as us", "us.id", "fb.user_id")
      .where(function () {
        if (user_id) {
          this.andWhere({ "fb.user_id": user_id });
        }
        if (status) {
          this.andWhere("fb.status", status);
        }
        if (from_date && to_date) {
          this.andWhereBetween("fb.created_at", [from_date, to_date]);
        }
        if (filter) {
          this.andWhere(function () {
            this.where("us.username", "ilike", `%${filter}%`).orWhere(
              "fb.pnr_code",
              "ilike",
              filter
            );
          });
        }
      })
      .orderBy("fb.id", "desc")
      .limit(limit ? parseInt(limit) : 100)
      .offset(skip ? parseInt(skip) : 0);

    const total = await this.db("flight_booking as fb")
      .withSchema(this.BTOC_SCHEMA)
      .count("fb.id as total")
      .leftJoin("users as us", "us.id", "fb.user_id")
      .where(function () {
        if (user_id) {
          this.andWhere({ "fb.user_id": user_id });
        }
        if (status) {
          this.andWhere("fb.status", status);
        }
        if (from_date && to_date) {
          this.andWhereBetween("fb.created_at", [from_date, to_date]);
        }
        if (filter) {
          this.andWhere(function () {
            this.where("us.username", "ilike", `%${filter}%`).orWhere(
              "fb.pnr_code",
              "ilike",
              filter
            );
          });
        }
      });

    console.log({ data });

    return { data, total: parseInt(total[0].total as string) };
  }

  // get single booking
  public async getSingleFlightBooking(wherePayload: {
    pnr_code?: string;
    id: number;
    status?: string;
    user_id?: number;
  }) {
    const { pnr_code, id, status, user_id } = wherePayload;
    return await this.db("flight_booking as fb")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        "fb.id as booking_id",
        "us.username as created_by",
        "fb.pnr_code",
        "fb.total_passenger",
        "fb.ticket_issue_last_time",
        "fb.status",
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
      .leftJoin("users as us", "us.id", "fb.created_by")
      .where(function () {
        this.andWhere({ "fb.id": id });
        if (pnr_code) {
          this.andWhere({ "fb.pnr_code": pnr_code });
        }
        if (status) {
          this.andWhere({ "fb.status": status });
        }
        if (user_id) {
          this.andWhere({ "fb.created_by": user_id });
        }
      });
  }

  //get flight segment
  public async getFlightSegment(flight_booking_id: number) {
    return await this.db("flight_segment")
      .withSchema(this.BTOC_SCHEMA)
      .select("*")
      .where({ flight_booking_id });
  }

  //get fight travelers
  public async getFlightTraveler(flight_booking_id: number) {
    return await this.db("flight_booking_traveler as fb")
      .withSchema(this.BTOC_SCHEMA)
      .select("fb.*")
      .where({ flight_booking_id });
  }

  // insert flight booking
  public async insertFlightBooking(payload: ICreateFlightBookingPayload) {
    return await this.db("flight_booking")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload, "id");
  }

  // insert flight segment
  public async insertFlightSegment(
    payload: IInsertFlightSegmentPayload | IInsertFlightSegmentPayload[]
  ) {
    return await this.db("flight_segment")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload);
  }
  // insert flight traveler
  public async insertFlightTraveler(
    payload: IInsertFlightTravelerPayload | IInsertFlightTravelerPayload[]
  ) {
    return await this.db("flight_booking_traveler")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload);
  }

  //update booking
  public async updateBooking(
    payload: { status?: string; cancelled_by?: number },
    id: number
  ) {
    return await this.db("flight_booking")
      .withSchema(this.BTOC_SCHEMA)
      .update(payload)
      .where({ id });
  }
}

export default FlightBookingModel;
