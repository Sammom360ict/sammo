"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class B2BFlightBookingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // get all flight booking
    getAllFlightBooking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status, user_id, from_date, to_date, name } = payload;
            const data = yield this.db("b2b.flight_booking as fb")
                .select("fb.id as booking_id", "ai.agency_name as agency_name", "us.name as created_by", this.db.raw("CONCAT(fb.contact_country_dialing_code,fb.contact_phone_number) as contact_number"), "fb.contact_email", "fb.order_reference", "fb.pnr_code", "fb.total_passenger", "fb.created_at as booking_created_at", "fb.status as booking_status", "fb.ticket_issue_last_time", "fb.payable_amount", "fb.journey_type")
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
                if (name) {
                    this.andWhere(function () {
                        this.where("us.name", "ilike", `%${name}%`)
                            .orWhere("ai.agency_name", "ilike", `%${name}%`)
                            .orWhere("fb.pnr_code", "ilike", `%${name}%`);
                    });
                }
            })
                .orderBy("fb.id", "desc")
                .limit(limit ? parseInt(limit) : 100)
                .offset(skip ? parseInt(skip) : 0);
            const total = yield this.db("b2b.flight_booking as fb")
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
                if (name) {
                    this.andWhere(function () {
                        this.where("us.name", "ilike", `%${name}%`)
                            .orWhere("ai.agency_name", "ilike", `%${name}%`)
                            .orWhere("fb.pnr_code", "ilike", name);
                    });
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    // get single booking
    getSingleFlightBooking(wherePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pnr_code, id, status, user_id, agency_id } = wherePayload;
            return yield this.db("b2b.flight_booking as fb")
                .select("fb.id as booking_id", "us.name as created_by", "ai.agency_name", this.db.raw("CONCAT(fb.contact_country_dialing_code,fb.contact_phone_number) as contact_number"), "fb.contact_email", "fb.pnr_code", "fb.order_reference", "fb.total_passenger", "fb.created_at as booking_created_at", "fb.status as booking_status", "fb.ticket_issue_last_time", "fb.payable_amount", "fb.ticket_price", "fb.base_fare", "fb.total_tax", "fb.ait", "fb.discount", "fb.journey_type")
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
                if (agency_id) {
                    this.andWhere({ "fb.agency_id": agency_id });
                }
            });
        });
    }
    //get flight segment
    getFlightSegment(flight_booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_segment")
                .withSchema(this.BTOB_SCHEMA)
                .select("*")
                .where({ flight_booking_id });
        });
    }
    //get fight travelers
    getFlightBookingTraveler(flight_booking_id, traveler_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("b2b.flight_booking_traveler as fb")
                .select("fb.*")
                .where({ flight_booking_id })
                .andWhere(function () {
                if (traveler_ids === null || traveler_ids === void 0 ? void 0 : traveler_ids.length) {
                    this.whereIn("id", traveler_ids);
                }
            });
        });
    }
    // insert flight booking
    insertFlightBooking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking")
                .withSchema(this.BTOB_SCHEMA)
                .insert(payload, "id");
        });
    }
    // insert flight segment
    insertFlightSegment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_segment")
                .withSchema(this.BTOB_SCHEMA)
                .insert(payload);
        });
    }
    // insert flight traveler
    insertFlightTraveler(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking_traveler")
                .withSchema(this.BTOB_SCHEMA)
                .insert(payload);
        });
    }
    // update flight booking traveler
    updateFlightBookingTraveler(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking_traveler")
                .withSchema(this.BTOB_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    //update booking
    updateBooking(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking")
                .withSchema(this.BTOB_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    // get single issue ticket
    getSingleIssueTicket(flight_booking_id, agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("b2b.flight_ticket_issue")
                .select("*")
                .where({ flight_booking_id });
        });
    }
    //get ticket segment
    getTicketSegment(flight_booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("b2b.flight_ticket_issue_segment")
                .select("*")
                .where({ flight_booking_id });
        });
    }
}
exports.default = B2BFlightBookingModel;
