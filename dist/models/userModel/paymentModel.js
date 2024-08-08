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
class PaymentModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert invoice model
    insertInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('invoice')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload, 'id');
        });
    }
    // create payment try
    createPaymentTry(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('payment_try').withSchema(this.DBO_SCHEMA).insert(payload, 'id');
        });
    }
    // get payment try
    getSinglePaymentTry(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('dbo.payment_try AS bpt')
                .select('bpt.id', 'bpt.status', 'bpt.booking_id', 'bpt.user_id', 'fb.payable_amount', 'fb.pnr_code', 'fb.status')
                .join('booking.flight_booking AS fb', 'bpt.booking_id', 'fb.id')
                .andWhere('bpt.user_id', user_id)
                .andWhere('bpt.id', id);
        });
    }
    // update payment try
    updatePaymentTry(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('dbo.payment_try').update(payload).where({ id });
        });
    }
    //get transactions
    getTransactions(userId, limit, skip, booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.db("dbo.invoice as inv")
                .select('inv.id', 'us.username', 'us.first_name', 'us.last_name', 'us.email', 'us.phone_number', 'inv.total_amount', 'inv.booking_id', 'inv.session_id', 'inv.type', 'inv.bank_tran_id', 'inv.transaction_date', 'fb.pnr_code', 'fb.status', 'fb.ticket_price', 'fb.base_fare', 'fb.total_tax', 'fb.payable_amount', 'fb.ait', 'fb.discount', 'fb.total_passenger', 'fb.journey_type')
                .leftJoin('booking.flight_booking as fb', 'inv.booking_id', 'fb.id')
                .join('user.users as us', 'us.id', 'inv.user_id')
                .orderBy('inv.id', 'desc')
                .limit(limit || 100)
                .offset(skip || 0)
                .where((qb) => {
                if (userId) {
                    qb.andWhere('inv.user_id', userId);
                }
                if (booking_id) {
                    qb.andWhere('inv.booking_id', booking_id);
                }
            });
            let count = [];
            count = yield this.db("dbo.invoice as inv")
                .count('inv.id as total')
                .leftJoin('booking.flight_booking as fb', 'inv.booking_id', 'fb.id')
                .where((qb) => {
                if (userId) {
                    qb.andWhere('inv.user_id', userId);
                }
                if (booking_id) {
                    qb.andWhere('inv.booking_id', booking_id);
                }
            });
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
}
exports.default = PaymentModel;
