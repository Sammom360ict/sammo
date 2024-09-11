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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const requestFomatter_1 = __importDefault(require("../../../utils/lib/requestFomatter"));
const constants_1 = require("../../../utils/miscellaneous/constants");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config/config"));
const sabreApiEndpoints_1 = require("../../../utils/miscellaneous/sabreApiEndpoints");
const sabreRequest_1 = __importDefault(require("../../../utils/lib/sabreRequest"));
const ticketIssue_service_1 = __importDefault(require("../../b2c/services/ticketIssue.service"));
class PaymentService extends abstract_service_1.default {
    constructor() {
        super();
        this.requestFormatter = new requestFomatter_1.default();
        this.ticketIssueService = new ticketIssue_service_1.default();
        this.sabreRequest = new sabreRequest_1.default();
    }
    // payment failed
    paymentFailed(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const tran_id = body.tran_id.split("-");
            if (tran_id.length !== 3) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Unverified Transaction",
                    redirect_url: `${constants_1.CLIENT_URL}/paymentFail/${undefined}`,
                };
            }
            const [paymentTryId, bookingId, user_id] = tran_id;
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Payment Failed",
                redirect_url: `${constants_1.CLIENT_URL}/paymentFail/${bookingId}`,
            };
        });
    }
    paymentSuccess(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const body = req.body;
            const tran_id = body.tran_id.split("-");
            console.log({ tran_id });
            if (tran_id.length !== 3) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Unverified Transaction",
                    redirect_url: `${constants_1.CLIENT_URL}/paymentFail/${undefined}`,
                };
            }
            const [paymentTryId, bookingId, user_id] = tran_id;
            const paymentModel = this.Model.paymentModel();
            const bookingModel = this.Model.btocFlightBookingModel();
            const paymentTry = yield paymentModel.getSinglePaymentTry(Number(paymentTryId), Number(user_id));
            if (!paymentTry.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Unverified Transaction",
                    redirect_url: `${constants_1.CLIENT_URL}/paymentFail/${bookingId}`,
                };
            }
            const { payable_amount, booking_id, pnr_code } = paymentTry[0];
            //confirm payment
            const ssl_response = yield axios_1.default.post(`${config_1.default.SSL_URL}/validator/api/validationserverAPI.php?val_id=${body === null || body === void 0 ? void 0 : body.val_id}&store_id=${config_1.default.SSL_STORE_ID}&store_passwd=${config_1.default.SSL_STORE_PASSWORD}&format=json`);
            if (((_a = ssl_response === null || ssl_response === void 0 ? void 0 : ssl_response.data) === null || _a === void 0 ? void 0 : _a.status) !== "VALID") {
                yield paymentModel.updatePaymentTry({
                    status: "FAILED",
                    description: `Payment was initiated but transaction was not verified. Session ID: ${body === null || body === void 0 ? void 0 : body.val_id}, Amount: ${payable_amount}`,
                }, paymentTryId);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Unverified transaction",
                    redirect_url: `${constants_1.CLIENT_URL}/paymentFail/${bookingId}`,
                };
            }
            else {
                yield paymentModel.insertInvoice({
                    user_id,
                    total_amount: ssl_response.data.amount,
                    booking_id,
                    session_id: body.val_id,
                    type: ssl_response.data.card_type,
                    bank_tran_id: ssl_response.data.bank_tran_id,
                    transaction_date: ssl_response.data.tran_date,
                });
                //---ticket issue---//
                const ticketReqBody = this.requestFormatter.ticketIssueReqBody(pnr_code);
                const response = yield this.sabreRequest.postRequest(sabreApiEndpoints_1.TICKET_ISSUE_ENDPOINT, ticketReqBody);
                if (((_c = (_b = response === null || response === void 0 ? void 0 : response.AirTicketRS) === null || _b === void 0 ? void 0 : _b.ApplicationResults) === null || _c === void 0 ? void 0 : _c.status) === "Complete") {
                    const ticket_res = yield this.ticketIssueService.ticketIssueDataInsert(booking_id, pnr_code);
                    if (ticket_res.success) {
                        yield paymentModel.updatePaymentTry({
                            status: "COMPLETED",
                            description: `Payment and ticket issued is completed. PNR:${pnr_code}`,
                        }, paymentTryId);
                        yield bookingModel.updateBooking({ status: "issued" }, booking_id);
                        return ticket_res;
                    }
                    else {
                        yield paymentModel.updatePaymentTry({
                            status: "PURCHASE_PENDING",
                            description: `Payment is completed. But Ticket not confirmed. PNR:${pnr_code}`,
                        }, paymentTryId);
                        yield bookingModel.updateBooking({ status: "paid" }, booking_id);
                        return ticket_res;
                    }
                }
                else {
                    yield paymentModel.updatePaymentTry({
                        status: "PURCHASE_PENDING",
                        description: `Payment is completed. But Ticket not issued. PNR:${pnr_code}`,
                    }, paymentTryId);
                    yield bookingModel.updateBooking({ status: "paid" }, booking_id);
                    return {
                        success: true,
                        message: "Ticket not issued. Please contact us.",
                        code: this.StatusCode.HTTP_OK,
                        redirect_url: `${constants_1.CLIENT_URL}/paymentSuccess/${bookingId}`,
                    };
                }
                //---ticket issue---//
            }
        });
    }
    //payment cancelled
    paymentCancelled(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const tran_id = body.tran_id.split("-");
            if (tran_id.length !== 3) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Unverified Transaction",
                    redirect_url: `${constants_1.CLIENT_URL}/paymentCancel/${undefined}`,
                };
            }
            const [paymentTryId, bookingId, user_id] = tran_id;
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Payment cancelled",
                redirect_url: `${constants_1.CLIENT_URL}/paymentCancel/${bookingId}`,
            };
        });
    }
}
exports.default = PaymentService;
