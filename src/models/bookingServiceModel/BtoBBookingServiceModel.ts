// import {
//   ICreateServiceRequestPayload,
//   IGetServiceRequestParams,
//   IGetSingleServiceRequestParams,
//   IUpdateServiceRequestPayload,
// } from "../../utils/interfaces/serviceRequestModel.interfaces";
import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  ICreateSupportMessagePayload,
  ICreateSupportPayload,
  ICreateSupportTicketsPayload,
  IUpdateBookingSupportPayload,
} from "../../utils/interfaces/btob/bookingSupport.interface";
import Schema from "../../utils/miscellaneous/schema";
export class BtoBBookingServiceModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }
  // insert support
  public async insertSupport(payload: ICreateSupportPayload) {
    return await this.db("booking_support")
      .withSchema(this.BTOB_SCHEMA)
      .insert(payload, "id");
  }
  // insert support ticket
  public async insertSupportTicket(
    payload: ICreateSupportTicketsPayload | ICreateSupportTicketsPayload[]
  ) {
    return await this.db("booking_support_tickets")
      .withSchema(this.BTOB_SCHEMA)
      .insert(payload);
  }
  // insert support message
  public async insertSupportMessage(payload: ICreateSupportMessagePayload) {
    return await this.db("booking_support_messages")
      .withSchema(this.BTOB_SCHEMA)
      .insert(payload);
  }
  //update support
  public async updateSupport(
    payload: IUpdateBookingSupportPayload,
    id: number
  ) {
    return await this.db("booking_support")
      .withSchema(this.BTOB_SCHEMA)
      .update(payload)
      .where({ id });
  }
  //get list
  public async getList(
    agency_id?: number,
    status?: string,
    limit?: number,
    skip?: number
  ) {
    const data = await this.db("booking_support as bs")
      .withSchema(this.BTOB_SCHEMA)
      .select(
        "bs.id",
        "bs.booking_id",
        "fb.pnr_code",
        "bs.support_type",
        "bs.status",
        "bs.created_at",
        "bu.name as created_by",
        "ua.first_name as closed_by",
        this.db.raw(`string_agg(bst.ticket_number, ', ') as ticket_numbers`)
      )
      .join("btob_user as bu", "bu.id", "bs.created_by")
      .join("flight_booking as fb", "fb.id", "bs.booking_id")
      .joinRaw("left join admin.user_admin as ua on ua.id = bs.closed_by")
      .leftJoin("booking_support_tickets as bst", "bs.id", "bst.support_id")
      .groupBy(
        "bs.id",
        "bs.booking_id",
        "fb.pnr_code",
        "bs.support_type",
        "bs.status",
        "bs.created_at",
        "bu.name",
        "bs.closed_by",
        "ua.first_name"
      )
      .where((qb) => {
        if (agency_id) {
          qb.andWhere("bs.agency_id", agency_id);
        }
        if (status) {
          qb.andWhere("bs.status", status);
        }
      })
      .orderBy("bs.created_at", "desc")
      .limit(limit || 100)
      .offset(skip || 0);

    const total = await this.db("booking_support as bs")
      .withSchema(this.BTOB_SCHEMA)
      .count("bs.id as total")
      .join("btob_user as bu", "bu.id", "bs.created_by")
      .join("flight_booking as fb", "fb.id", "bs.booking_id")
      .joinRaw("left join admin.user_admin as ua on ua.id = bs.closed_by")
      .leftJoin("booking_support_tickets as bst", "bs.id", "bst.support_id")
      .groupBy(
        "bs.id",
        "bs.booking_id",
        "fb.pnr_code",
        "bs.support_type",
        "bs.status",
        "bs.created_at",
        "bu.name",
        "bs.closed_by",
        "ua.first_name"
      )
      .where((qb) => {
        if (agency_id) {
          qb.andWhere("bs.agency_id", agency_id);
        }
        if (status) {
          qb.andWhere("bs.status", status);
        }
      });

    return { data, total: total[0]?.total };
  }
  //get single support
  public async getSingleSupport(payload: {
    id: number;
    agency_id?: number;
    notStatus?: string;
  }) {
    return await this.db("booking_support as bs")
      .withSchema(this.BTOB_SCHEMA)
      .select(
        "bs.id",
        "bs.booking_id",
        "fb.pnr_code",
        "bs.support_type",
        "bs.status",
        "bs.created_at",
        "bu.name as created_by",
        "ua.first_name as closed_by"
      )
      .join("btob_user as bu", "bu.id", "bs.created_by")
      .join("flight_booking as fb", "fb.id", "bs.booking_id")
      .joinRaw("left join admin.user_admin as ua on ua.id = bs.closed_by")
      .where("bs.id", payload.id)
      .andWhere((qb) => {
        if (payload.agency_id) {
          qb.andWhere("bs.agency_id", payload.agency_id);
        }
        if (payload.notStatus) {
          qb.andWhereNot("bs.status", payload.notStatus);
        }
      });
  }
  //get tickets of a support
  public async getTickets(support_id: number) {
    return await this.db("booking_support_tickets as bst")
      .withSchema(this.BTOB_SCHEMA)
      .select(
        "bst.id",
        "fti.traveler_reference",
        "fti.traveler_given_name",
        "fti.traveler_surname",
        "fti.reservation_code",
        "fti.ticket_number"
      )
      .join("flight_ticket_issue as fti", "fti.id", "bst.traveler_id")
      .where("bst.support_id", support_id);
  }
  //get messages
  public async getMessages(payload: {
    limit?: number;
    skip?: number;
    support_id: number;
  }) {
    const data = await this.db("booking_support_messages as bsm")
      .withSchema(this.BTOB_SCHEMA)
      .select("id", "message", "attachment", "sender", "created_at")
      .where("support_id", payload.support_id)
      .limit(payload.limit || 100)
      .offset(payload.skip || 0)
      .orderBy("id", "desc");

    const total = await this.db("booking_support_messages as bsm")
      .withSchema(this.BTOB_SCHEMA)
      .count("id as total")
      .where("support_id", payload.support_id);
    return { data, total: total[0]?.total };
  }
  // // Get service request model
  // public async get(params: IGetServiceRequestParams, total?: boolean) {
  //     const data = await this.db('service_request_view')
  //         .withSchema(this.SCHEMA_OTA)
  //         .select(
  //             'id',
  //             'status',
  //             'pnr_code',
  //             'request_type',
  //             'agency_name',
  //             'agency_id',
  //             'agency_logo',
  //             'created_at'
  //         )
  //         .where((qb) => {
  //             if (params.agency_id) {
  //                 qb.andWhere('agency_id', params.agency_id);
  //             }
  //             if (params.status) {
  //                 qb.andWhere('status', params.status);
  //             }
  //             if (params.request_type) {
  //                 qb.andWhere('request_type', params.request_type);
  //             }
  //             if (params.agency_name) {
  //                 qb.andWhereILike('agency_name', `%${params.request_type}%`);
  //             }
  //         })
  //         .limit(params.limit ? Number(params.limit) : 100)
  //         .offset(params.skip ? Number(params.skip) : 0);
  //     let count: any[] = [];
  //     if (total) {
  //         count = await this.db('service_request_view')
  //             .withSchema(this.SCHEMA_OTA)
  //             .count('id AS total')
  //             .where((qb) => {
  //                 if (params.agency_id) {
  //                     qb.andWhere('agency_id', params.agency_id);
  //                 }
  //                 if (params.status) {
  //                     qb.andWhere('status', params.status);
  //                 }
  //                 if (params.request_type) {
  //                     qb.andWhere('request_type', params.request_type);
  //                 }
  //                 if (params.agency_name) {
  //                     qb.andWhereILike('agency_name', `%${params.request_type}%`);
  //                 }
  //             });
  //     }
  //     return {
  //         data,
  //         total: count.length ? count[0].total : null,
  //     };
  // }
  // // get single
  // public async getSingle({ agency_id, id }: IGetSingleServiceRequestParams) {
  //     return await this.db('service_request_view')
  //         .withSchema(this.SCHEMA_OTA)
  //         .select(
  //             'id',
  //             'status',
  //             'request_type',
  //             'agency_name',
  //             'agency_id',
  //             'agency_logo',
  //             'created_at',
  //             'resolved_at',
  //             'note',
  //             'pnr_code',
  //             'airline_pnr',
  //             'agency_mobile_number',
  //             'created_by_id',
  //             'created_by_first_name',
  //             'created_by_last_name',
  //             'resolved_by_id',
  //             'resolved_by_name',
  //             'description'
  //         )
  //         .where((qb) => {
  //             if (agency_id) {
  //                 qb.andWhere('agency_id', agency_id);
  //             }
  //             qb.andWhere('id', id);
  //         });
  // }
  // // update
  // public async update(payload: IUpdateServiceRequestPayload, id: number) {
  //     return await this.db('service_request')
  //         .withSchema(this.SCHEMA_OTA)
  //         .update(payload)
  //         .where({ id });
  // }
}
