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
exports.BookingRequestService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class BookingRequestService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get booking request
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const bookingReqModel = this.Model.flightBookingModel();
            const { data, total } = yield bookingReqModel.getAllFlightBooking(Object.assign({}, query));
            return {
                success: true,
                data,
                total,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    // get single booking request
    getSingle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const bookingReqModel = this.Model.flightBookingModel();
            const data = yield bookingReqModel.getSingleFlightBooking({ id: Number(id) });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const segments = yield bookingReqModel.getFlightSegment(Number(id));
            const travelers = yield bookingReqModel.getFlightTraveler(Number(id));
            return {
                success: true,
                data: Object.assign(Object.assign({}, data[0]), { segments, travelers }),
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    // update booking request
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { id: admin_id } = req.admin;
            const { status, note } = req.body;
            const bookingReqModel = this.Model.bookingRequestModel();
            const data = yield bookingReqModel.getSingle({ id: Number(id) });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            if (data[0].status !== 'Pending') {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.STATUS_CANNOT_CHANGE,
                };
            }
            yield bookingReqModel.update({ status, note, updated_by: admin_id }, Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.BookingRequestService = BookingRequestService;
