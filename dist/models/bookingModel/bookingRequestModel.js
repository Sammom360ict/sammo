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
exports.BookingRequestModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class BookingRequestModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert booking request
    insert(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking_request")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload, "id");
        });
    }
    // get booking request
    get(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, total = false) {
            var _a;
            const data = yield this.db("booking.booking_request AS bbr")
                .select("bbr.id", "bbr.status", "bbr.journey_type", "bbr.created_date", "bbr.payable", "bbr.note", "us.id AS user_id", "us.username", "us.photo AS user_photo", "us.phone_number", "bbr.origin", "bbr.destination", this.db.raw(`
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
        `))
                .join("user.users as us", "us.id", "bbr.user_id")
                .leftJoin("booking.booking_request_segment as brs", "bbr.id", "brs.booking_request_id")
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
                .groupBy("bbr.id", "bbr.status", "bbr.journey_type", "bbr.created_date", "bbr.payable", "bbr.note", "us.id", "us.username", "us.photo", "us.phone_number", "bbr.origin", "bbr.destination")
                .limit(params.limit ? Number(params.limit) : 100)
                .offset(params.skip ? Number(params.skip) : 0)
                .orderBy("bbr.id", "desc");
            let count = [];
            if (total) {
                count = yield this.db("booking.booking_request AS bbr")
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
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    // get single
    getSingle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking.booking_request AS bbr")
                .select("bbr.id", "bbr.status", "bbr.journey_type", "bbr.ait", "bbr.created_date", "bbr.note", "bbr.commission", "bbr.total_price", "bbr.base_fair", "bbr.total_tax", "bbr.discount", "bbr.payable", "bbr.total_travelers", "bbr.traveler_adult", "bbr.traveler_children", "bbr.traveler_kids", "bbr.traveler_infants", "bu.id AS user_id", "bu.username AS username", "bu.photo AS user_photo", "bu.email AS user_email", "bu.phone_number AS user_phone", "ad.id AS admin_id", "ad.username AS admin_name", "ad.photo AS admin_photo")
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
        });
    }
    // update
    update(payload, id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking_request")
                .withSchema(this.BTOC_SCHEMA)
                .update(payload)
                .where((qb) => {
                qb.andWhere({ id });
                if (user_id) {
                    qb.andWhere({ user_id });
                }
            });
        });
    }
    // insert segment
    insertSegment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking_request_segment")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload);
        });
    }
    // get segment
    getSegment(booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking_request_segment")
                .withSchema(this.BTOC_SCHEMA)
                .select("*")
                .where({ booking_request_id: booking_id });
        });
    }
    // get booking request count
    getBookingRequestCount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from_date, status, to_date, }) {
            const total = yield this.db("booking_request")
                .withSchema(this.BTOC_SCHEMA)
                .count("id AS total")
                .where((qb) => {
                qb.andWhereBetween("created_at", [from_date, to_date]);
                if (status) {
                    qb.andWhere({ status });
                }
            });
            return total[0].total;
        });
    }
    //insert traveler
    insertTraveler(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking_request_traveler")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload);
        });
    }
    // get traveler
    getTraveler(booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking.booking_request_traveler as tr")
                .select("tr.*", "ci.name as city_name")
                .join("dbo.city as ci", "ci.id", "tr.city_id")
                .where({ booking_request_id: booking_id });
        });
    }
}
exports.BookingRequestModel = BookingRequestModel;
