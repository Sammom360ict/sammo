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
class FlightBookingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // get all flight booking
    getAllFlightBooking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status, user_id, from_date, to_date, filter } = payload;
            const data = yield this.db("flight_booking as fb")
                .withSchema(this.BTOC_SCHEMA)
                .select("fb.id as booking_id", "us.username", "fb.pnr_code", "fb.total_passenger", "fb.ticket_issue_last_time", "fb.status", "fb.payable_amount", "fb.discount", "fb.ticket_price", "fb.journey_type", "fb.created_at")
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
                        this.where("us.username", "ilike", `%${filter}%`).orWhere("fb.pnr_code", "ilike", filter);
                    });
                }
            })
                .orderBy("fb.id", "desc")
                .limit(limit ? parseInt(limit) : 100)
                .offset(skip ? parseInt(skip) : 0);
            const total = yield this.db("flight_booking as fb")
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
                        this.where("us.username", "ilike", `%${filter}%`).orWhere("fb.pnr_code", "ilike", filter);
                    });
                }
            });
            console.log({ data });
            return { data, total: parseInt(total[0].total) };
        });
    }
    // get single booking
    getSingleFlightBooking(wherePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pnr_code, id, status, user_id } = wherePayload;
            return yield this.db("flight_booking as fb")
                .withSchema(this.BTOC_SCHEMA)
                .select("fb.id as booking_id", "us.username as created_by", "fb.pnr_code", "fb.total_passenger", "fb.ticket_issue_last_time", "fb.status", "fb.ticket_price", "fb.base_fare", "fb.total_tax", "fb.commission", "fb.payable_amount", "fb.ait", "fb.discount", "fb.journey_type", "fb.created_at")
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
        });
    }
    //get flight segment
    getFlightSegment(flight_booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_segment")
                .withSchema(this.BTOC_SCHEMA)
                .select("*")
                .where({ flight_booking_id });
        });
    }
    //get fight travelers
    getFlightTraveler(flight_booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking_traveler as fb")
                .withSchema(this.BTOC_SCHEMA)
                .select("fb.*")
                .where({ flight_booking_id });
        });
    }
    // insert flight booking
    insertFlightBooking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload, "id");
        });
    }
    // insert flight segment
    insertFlightSegment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_segment")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload);
        });
    }
    // insert flight traveler
    insertFlightTraveler(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking_traveler")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload);
        });
    }
    //update booking
    updateBooking(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_booking")
                .withSchema(this.BTOC_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
}
exports.default = FlightBookingModel;
