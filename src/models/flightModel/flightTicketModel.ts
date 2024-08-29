import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IFlightTicketIssuePayload,
  IFlightTicketIssueSegmentPayload,
} from "../../utils/interfaces/flight/flightBookingInterface";
import Schema from "../../utils/miscellaneous/schema";

class FlightTicketModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // get single issue ticket
  public async getSingleIssueTicket(flight_booking_id: number) {
    return await this.db("flight_ticket_issue")
      .withSchema(this.BTOC_SCHEMA)
      .select("*")
      .where({ flight_booking_id });
  }

  //get ticket segment
  public async getTicketSegment(flight_booking_id: number) {
    return await this.db("flight_ticket_issue_segment")
      .withSchema(this.BTOC_SCHEMA)
      .select("*")
      .where({ flight_booking_id });
  }

  //create flight ticket issue info
  public async createFlightTicketIssue(payload: IFlightTicketIssuePayload) {
    return await this.db("flight_ticket_issue")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload, "id");
  }

  //create flight ticket segment info
  public async createFlightTicketSegment(
    payload: IFlightTicketIssueSegmentPayload
  ) {
    return await this.db("flight_ticket_issue_segment")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload, "id");
  }
}

export default FlightTicketModel;
