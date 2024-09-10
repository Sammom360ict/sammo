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
            const data = yield this.db(`${this.BTOC_SCHEMA}.booking_request as fb`)
                .select("fb.id as booking_id", "us.username as created_by", "fb.total_passenger", "fb.ticket_issue_last_time", "fb.status", "fb.payable_amount", "fb.discount", "fb.ticket_price", "fb.journey_type", "fb.created_at", this.db.raw(`
                    CONCAT(
                      DATE(MIN(brs.departure_date)),
                      ' ',
                      (SELECT fs_inner.departure_time
                       FROM ${this.BTOC_SCHEMA}.booking_request_segment fs_inner
                       WHERE fs_inner.booking_request_id = fb.id
                         AND fs_inner.departure_date = MIN(brs.departure_date)
                       LIMIT 1)
                    ) as flight_date
                  `), this.db.raw(`
                    CONCAT(
                      SUBSTRING(MIN(brs.origin) FROM POSITION(',' IN MIN(brs.origin)) + 1 FOR POSITION(')' IN MIN(brs.origin)) - POSITION(',' IN MIN(brs.origin)) - 1),
                      ' - ',
                      STRING_AGG(
                        SUBSTRING(brs.destination FROM POSITION(',' IN brs.destination) + 1 FOR POSITION(')' IN brs.destination) - POSITION(',' IN brs.destination) - 1),
                        ' - '
                        ORDER BY brs.departure_date ASC
                      )
                    ) as route
                  `))
                .leftJoin(`${this.BTOC_SCHEMA}.users as us`, "us.id", "fb.created_by")
                .leftJoin(`${this.BTOC_SCHEMA}.booking_request_segment as brs`, "brs.booking_request_id", "fb.id")
                .groupBy("fb.id", "us.username", "fb.total_passenger", "fb.ticket_issue_last_time", "fb.status", "fb.payable_amount", "fb.discount", "fb.ticket_price", "fb.journey_type", "fb.created_at")
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
            let count = [];
            if (total) {
                count = yield this.db(`${this.BTOC_SCHEMA}.booking_request as fb`)
                    .count("fb.id as total")
                    .leftJoin("b2c.users as us", "us.id", "fb.created_by")
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
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    // get single
    getSingle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(`${this.BTOC_SCHEMA}.booking_request as fb`)
                .select("fb.id as booking_id", "us.username as created_by", "fb.total_passenger", "fb.ticket_issue_last_time", "fb.status", "fb.ticket_price", "fb.base_fare", "fb.total_tax", "fb.commission", "fb.payable_amount", "fb.ait", "fb.discount", "fb.journey_type", "fb.created_at")
                .leftJoin("b2c.users as us", "us.id", "fb.created_by")
                .where((qb) => {
                if (params.id) {
                    qb.andWhere("fb.id", params.id);
                }
                if (params.user_id) {
                    qb.andWhere("fb.user_id", params.user_id);
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
            return yield this.db(`${this.BTOC_SCHEMA}.booking_request_traveler as tr`)
                .select("tr.*")
                .where({ booking_request_id: booking_id });
        });
    }
}
exports.BookingRequestModel = BookingRequestModel;
