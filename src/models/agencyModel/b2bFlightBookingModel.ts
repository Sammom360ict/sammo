import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  ICreateFlightBookingPayload,
  IInsertFlightSegmentPayload,
  IInsertFlightTravelerPayload,
} from "../../utils/interfaces/agent/b2bFlightBookingInterface";
import Schema from "../../utils/miscellaneous/schema";

class B2BFlightBookingModel extends Schema {
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

    const data = await this.db("b2b.flight_booking as fb")
      .select(
        "fb.id as booking_id",
        "ai.agency_name as agency_name",
        "us.name as created_by",
        this.db.raw(
          "CONCAT(fb.contact_country_dialing_code,fb.contact_phone_number) as contact_number"
        ),
        "fb.contact_email",
        "fb.order_reference",
        "fb.pnr_code",
        "fb.total_passenger",
        "fb.created_at as booking_created_at",
        "fb.status as booking_status",
        "fb.ticket_issue_last_time",
        "fb.payable_amount",
        "fb.journey_type"
      )
      .leftJoin("b2b.btob_user as us", "us.id", "fb.created_by")
      .leftJoin("b2b.agency_info as ai", "ai.id", "us.agency_id")
      .where(function () {
        if (user_id) {
          this.andWhere({ "fb.created_by": user_id });
        }
        if (status) {
          this.andWhere("fb.status", status);
        }
        if (from_date && to_date) {
          this.andWhereBetween("fb.created_at", [from_date, to_date]);
        }
        if (filter) {
          this.andWhere(function () {
            this.where("us.name", "ilike", `%${filter}%`)
              .orWhere("ai.agency_name", "ilike", `%${filter}%`)
              .orWhere("fb.pnr_code", "ilike", filter);
          });
        }
      })
      .orderBy("fb.id", "desc")
      .limit(limit ? parseInt(limit) : 100)
      .offset(skip ? parseInt(skip) : 0);

    const total = await this.db("b2b.flight_booking as fb")
      .count("fb.id as total")
      .leftJoin("b2b.btob_user as us", "us.id", "fb.created_by")
      .leftJoin("b2b.agency_info as ai", "ai.id", "us.agency_id")
      .where(function () {
        if (user_id) {
          this.andWhere({ "fb.created_by": user_id });
        }
        if (status) {
          this.andWhere("fb.status", status);
        }
        if (from_date && to_date) {
          this.andWhereBetween("fb.created_at", [from_date, to_date]);
        }
        if (filter) {
          this.andWhere(function () {
            this.where("us.name", "ilike", `%${filter}%`)
              .orWhere("ai.agency_name", "ilike", `%${filter}%`)
              .orWhere("fb.pnr_code", "ilike", filter);
          });
        }
      });

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
    return await this.db("b2b.flight_booking as fb")
      .select(
        "fb.id as booking_id",
        "us.name as created_by",
        "ai.agency_name",
        this.db.raw(
          "CONCAT(fb.contact_country_dialing_code,fb.contact_phone_number) as contact_number"
        ),
        "fb.contact_email",
        "fb.pnr_code",
        "fb.order_reference",
        "fb.total_passenger",
        "fb.created_at as booking_created_at",
        "fb.status as booking_status",
        "fb.ticket_issue_last_time",
        "fb.payable_amount",
        "fb.ticket_price",
        "fb.base_fare",
        "fb.total_tax",
        "fb.ait",
        "fb.discount",
        "fb.journey_type"
      )
      .leftJoin("b2b.btob_user as us", "us.id", "fb.created_by")
      .leftJoin("b2b.agency_info as ai", "ai.id", "us.agency_id")
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
      .withSchema(this.BTOB_SCHEMA)
      .select("*")
      .where({ flight_booking_id });
  }

  //get fight travelers
  public async getFlightTraveler(flight_booking_id: number) {
    return await this.db("b2b.flight_booking_traveler as fb")
      .select("fb.*")
      .where({ flight_booking_id });
  }

  // insert flight booking
  public async insertFlightBooking(payload: ICreateFlightBookingPayload) {
    return await this.db("flight_booking")
      .withSchema(this.BTOB_SCHEMA)
      .insert(payload, "id");
  }

  // insert flight segment
  public async insertFlightSegment(
    payload: IInsertFlightSegmentPayload | IInsertFlightSegmentPayload[]
  ) {
    return await this.db("flight_segment")
      .withSchema(this.BTOB_SCHEMA)
      .insert(payload);
  }
  // insert flight traveler
  public async insertFlightTraveler(
    payload: IInsertFlightTravelerPayload | IInsertFlightTravelerPayload[]
  ) {
    return await this.db("flight_booking_traveler")
      .withSchema(this.BTOB_SCHEMA)
      .insert(payload);
  }

  //update booking
  public async updateBooking(
    payload: { status?: string; cancelled_by?: number },
    id: number
  ) {
    return await this.db("flight_booking")
      .withSchema(this.BTOB_SCHEMA)
      .update(payload)
      .where({ id });
  }

  // get single issue ticket
  public async getSingleIssueTicket(
    flight_booking_id: number,
    agency_id?: number
  ) {
    return await this.db("b2b.flight_ticket_issue")
      .select("*")
      .where({ flight_booking_id });
  }

  //get ticket segment
  public async getTicketSegment(flight_booking_id: number) {
    return await this.db("b2b.flight_ticket_issue_segment")
      .select("*")
      .where({ flight_booking_id });
  }
}

export default B2BFlightBookingModel;
