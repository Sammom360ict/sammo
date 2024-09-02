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
exports.BtoBBookingServiceModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class BtoBBookingServiceModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert support
    insertSupport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_booking_support")
                .withSchema(this.BTOB_SCHEMA)
                .insert(payload);
        });
    }
    // insert support ticket
    insertSupportTicket(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_booking_support_tickets")
                .withSchema(this.BTOB_SCHEMA)
                .insert(payload);
        });
    }
    // insert support message
    insertSupportMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_booking_support_messages")
                .withSchema(this.BTOB_SCHEMA)
                .insert(payload);
        });
    }
    //update support
    updateSupport(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_booking_support")
                .withSchema(this.BTOB_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    //get list
    getList(agent_id, status, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.db("btob_booking_support as bs")
                .withSchema(this.BTOB_SCHEMA)
                .select("bs.id", "bs.booking_id", "fb.pnr_code", "bs.support_type", "bs.status", "bs.created_at", "bu.name as created_by", "ua.first_name as name as closed_by", this.db.raw(`string_agg(bst.ticket_number, ', ') as ticket_numbers`))
                .join("btob_user as bu", "bu.id", "bs.created_by")
                .join("flight_booking as fb", "fb.id", "bs.booking_id")
                .joinRaw("left join admin.user_admin as ua on ua.id = bs.closed_by")
                .leftJoin("btob_booking_support_tickets as bst", "bs.id", "bst.support_id")
                .groupBy("bs.id", "bs.booking_id", "fb.pnr_code", "bs.support_type", "bs.status", "bs.created_at", "bu.name", "bs.closed_by", "ua.first_name")
                .where((qb) => {
                if (agent_id) {
                    qb.andWhere("bs.created_by", agent_id);
                }
                if (status) {
                    qb.andWhere("bs.status", status);
                }
            })
                .orderBy("bs.created_at", "desc")
                .limit(limit || 100)
                .offset(skip || 0);
            const total = yield this.db("btob_booking_support as bs")
                .withSchema(this.BTOB_SCHEMA)
                .count("bs.id as total")
                .where((qb) => {
                if (agent_id) {
                    qb.andWhere("bs.created_by", agent_id);
                }
                if (status) {
                    qb.andWhere("bs.status", status);
                }
            });
            return { data, total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    //get single support
    getSingleSupport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_booking_support as bs")
                .select("bs.id", "bs.booking_id", "fb.pnr_code", "bs.support_type", "bs.status", "bs.created_at", "bu.name as created_by", "ua.first_name as name as closed_by")
                .join("btob_user as bu", "bu.id", "bs.created_by")
                .join("flight_booking as fb", "fb.id", "bs.booking_id")
                .joinRaw("left join admin.user_admin as ua on ua.id = bs.closed_by")
                .where("bs.id", payload.id)
                .andWhere((qb) => {
                if (payload.agent_id) {
                    qb.andWhere("bs.created_by", payload.agent_id);
                }
                if (payload.notStatus) {
                    qb.andWhereNot("bs.status", payload.notStatus);
                }
            });
        });
    }
    //get tickets of a support
    getTickets(support_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_booking_support_tickets as bst")
                .select("bst.id", "fti.traveler_reference", "fti.traveler_given_name", "fti.traveler_surname", "fti.reservation_code", "fti.ticket_number")
                .join("flight_ticket_issue as fti", "fti.id", "bst.traveler_id")
                .where("bst.support_id", support_id);
        });
    }
    //get messages
    getMessages(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.db("btob_booking_support_messages as bsm")
                .withSchema(this.BTOB_SCHEMA)
                .select("id", "message", "attachment", "sender", "created_at")
                .where("support_id", payload.support_id)
                .limit(payload.limit || 100)
                .offset(payload.skip || 0)
                .orderBy("id", "desc");
            const total = yield this.db("btob_booking_support_messages as bsm")
                .withSchema(this.BTOB_SCHEMA)
                .count("id as total")
                .where("support_id", payload.support_id);
            return { data, total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
}
exports.BtoBBookingServiceModel = BtoBBookingServiceModel;
