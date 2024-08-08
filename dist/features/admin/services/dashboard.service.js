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
class AdminDashboardService extends abstract_service_1.default {
    //dashboard
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin_model = this.Model.adminModel();
            const booking_total_data = yield admin_model.adminDashboard();
            // const booking_model = this.Model.bookingRequestModel();
            // const booking_data = await booking_model.get({limit:"5", status:'Pending'})
            const flight_model = this.Model.flightBookingModel();
            const booking_data = yield flight_model.getAllFlightBooking({ limit: "5", skip: "0" });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: { booking_total: booking_total_data.total_booking, booking_data: booking_data.data, booking_graph: booking_total_data.booking_graph }
            };
        });
    }
}
exports.default = AdminDashboardService;
