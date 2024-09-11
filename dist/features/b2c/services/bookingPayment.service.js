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
exports.BookingPaymentServices = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const payment_service_1 = require("./subServices/payment.service");
class BookingPaymentServices extends abstract_service_1.default {
    constructor() {
        super(...arguments);
        this.subServices = new payment_service_1.BookingPaymentService();
    }
    //create payment
    createPayment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id, first_name, email, phone_number } = req.user;
            const { booking_id } = req.body;
            if (!booking_id) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                    message: this.ResMsg.HTTP_UNPROCESSABLE_ENTITY,
                };
            }
            const booking_model = this.Model.btocFlightBookingModel();
            const booking_data = yield booking_model.getSingleFlightBooking({
                id: Number(booking_id),
                status: "pending",
            });
            if (!booking_data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            //payment session
            const paymentModel = this.Model.paymentModel();
            const paymentTry = yield paymentModel.createPaymentTry({
                user_id,
                pnr_id: booking_data[0].pnr_code,
                booking_id: Number(booking_id),
                status: "INITIATE",
                description: "Payment initiate completed.",
                amount: booking_data[0].payable_amount,
                currency: "BDT",
            });
            return yield this.subServices.sslPayment({
                total_amount: booking_data[0].payable_amount,
                currency: "BDT",
                tran_id: `${paymentTry[0].id}-${booking_id}-${user_id}`,
                cus_name: first_name,
                cus_email: email,
                cus_add1: "Dhaka",
                cus_city: "Dhaka",
                cus_country: "Bangladesh",
                cus_phone: phone_number,
                product_name: "ticket issue",
            });
        });
    }
    //get transaction
    getTransaction(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const model = this.Model.paymentModel();
            const { limit, skip, booking_id } = req.query;
            const data = yield model.getTransactions(id, limit, skip, booking_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
}
exports.BookingPaymentServices = BookingPaymentServices;
