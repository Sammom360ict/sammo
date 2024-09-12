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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const requestFomatter_1 = __importDefault(require("../../../utils/lib/requestFomatter"));
const responseFormatter_1 = __importDefault(require("../../../utils/lib/responseFormatter"));
const sabreRequest_1 = __importDefault(require("../../../utils/lib/sabreRequest"));
const sabreApiEndpoints_1 = require("../../../utils/miscellaneous/sabreApiEndpoints");
const bookingFlight_service_1 = __importDefault(require("./bookingFlight.service"));
class flightBookingService extends abstract_service_1.default {
    constructor() {
        super();
        this.ResFormatter = new responseFormatter_1.default();
        this.RequestFormatter = new requestFomatter_1.default();
        this.BookingFlightService = new bookingFlight_service_1.default();
        this.request = new sabreRequest_1.default();
    }
    flightBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const search_id = req.query.search_id;
            // const flight_id = body.flight_id;
            const { flight_id, passengers: traveler } = req.body;
            const { id: user_id } = req.user;
            const commission_per = 5;
            // const data = await revalidateFlight(clientIP, flight_id);
            const data = yield this.BookingFlightService.subRevalidate(search_id, flight_id
            // agency_commission
            );
            console.log({ data });
            if (!data) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const requestBody = this.RequestFormatter.pnrReqBody(body, data);
                const response = yield this.request.postRequest(sabreApiEndpoints_1.FLIGHT_BOOKING_ENDPOINT, requestBody);
                console.log({ response });
                if (!response) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                    };
                }
                if (((_b = (_a = response === null || response === void 0 ? void 0 : response.CreatePassengerNameRecordRS) === null || _a === void 0 ? void 0 : _a.ApplicationResults) === null || _b === void 0 ? void 0 : _b.status) !==
                    "Complete") {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.HTTP_BAD_REQUEST,
                        data: response.CreatePassengerNameRecordRS.ApplicationResults,
                    };
                }
                const formattedResponse = yield this.ResFormatter.pnrResponseFormatter(response);
                const { LastTicketingDate, pnrId: pnr_code, PersonName, FlightSegment, } = formattedResponse;
                //save traveler
                const travelersModel = this.Model.travelerModel();
                const traveler_promises = body.passengers.map((element) => __awaiter(this, void 0, void 0, function* () {
                    if (element.save_information) {
                        const { mid_name, save_information, country, passport_expire_date, reference, phone } = element, rest = __rest(element, ["mid_name", "save_information", "country", "passport_expire_date", "reference", "phone"]);
                        return travelersModel.insertTraveler(Object.assign({ user_id, first_name: mid_name, title: reference, mobile_number: phone, country_id: country ? Number(country) : undefined, passport_expiry_date: passport_expire_date
                                ? passport_expire_date.split("T")[0]
                                : undefined }, rest));
                    }
                }));
                yield Promise.all(traveler_promises);
                // create pnr
                const flightBookingModel = this.Model.btocFlightBookingModel(trx);
                const ticket_price = data.fare.total_price;
                const base_fare = data.fare.base_fare;
                const total_tax = data.fare.total_tax;
                const ait = data.fare.ait;
                const discount = data.fare.discount;
                const commission = data.fare.commission;
                const payable_amount = data.fare.payable;
                let ticket_issue_last_time = undefined;
                if (data.ticket_last_date && data.ticket_last_time) {
                    ticket_issue_last_time =
                        String(data.ticket_last_date) + " " + String(data.ticket_last_time);
                }
                const { passengers, flights, leg_descriptions } = data;
                let journey_type = "One way";
                if (leg_descriptions.length == 2) {
                    journey_type = "Round Trip";
                }
                if (leg_descriptions.length > 2) {
                    journey_type = "Multi City";
                }
                //insert flight booking
                const res = yield flightBookingModel.insertFlightBooking({
                    user_id,
                    pnr_code,
                    total_passenger: PersonName.length,
                    created_by: user_id,
                    ticket_issue_last_time: ticket_issue_last_time,
                    base_fare,
                    commission,
                    journey_type,
                    commission_per,
                    payable_amount,
                    ticket_price,
                    total_tax,
                    ait,
                    discount,
                });
                //insert segment
                let flight_class = "";
                let baggage = "";
                passengers.forEach((item) => {
                    flight_class = `${item.availability[0].segments[0].cabin_type}(${item.availability[0].segments[0].booking_code})`;
                    baggage = `${item.availability[0].baggage.count} ${item.availability[0].baggage.unit}`;
                });
                const segmentBody = [];
                flights.forEach((flight) => {
                    flight.options.forEach((option) => {
                        segmentBody.push({
                            flight_booking_id: res[0].id,
                            airline: option.carrier.carrier_marketing_airline,
                            airline_logo: option.carrier.carrier_marketing_logo,
                            arrival_date: option.arrival.date,
                            airline_code: option.carrier.carrier_marketing_code,
                            arrival_time: option.arrival.time,
                            departure_date: option.departure.date,
                            departure_time: option.departure.time,
                            baggage,
                            class: flight_class,
                            destination: option.arrival.airport +
                                " (" +
                                option.arrival.city +
                                "-" +
                                option.arrival.city_code +
                                ")",
                            flight_number: `${option.carrier.carrier_marketing_code} ${option.carrier.carrier_marketing_flight_number}`,
                            origin: option.departure.airport +
                                " (" +
                                option.departure.city +
                                "-" +
                                option.departure.city_code +
                                ")",
                        });
                    });
                });
                yield flightBookingModel.insertFlightSegment(segmentBody);
                //insert traveler
                let travelerBody = [];
                travelerBody = traveler.map((obj) => {
                    const { save_information, passport_expire_date } = obj, rest = __rest(obj, ["save_information", "passport_expire_date"]);
                    return Object.assign(Object.assign({}, rest), { flight_booking_id: res[0].id, passport_expiry_date: passport_expire_date
                            ? passport_expire_date.split("T")[0]
                            : undefined });
                });
                yield flightBookingModel.insertFlightTraveler(travelerBody);
                return {
                    success: true,
                    message: "Pnr has been created successfully",
                    ticketLastDateTime: ticket_issue_last_time
                        ? ticket_issue_last_time
                        : null,
                    booking_id: res[0].id,
                    // data: formattedResponse,
                    // response,
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
    }
    getAllFlightBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.user;
            const { status, limit, skip, from_date, to_date } = req.query;
            const flightBookingModel = this.Model.btocFlightBookingModel();
            const { data, total } = yield flightBookingModel.getAllFlightBooking({
                limit: limit,
                skip: skip,
                user_id: user_id,
                status: status,
                from_date: from_date,
                to_date: to_date,
            });
            return {
                success: true,
                data,
                total,
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
    // get single flight booking
    getSingleFlightBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.user;
            const { id } = req.params;
            const model = this.Model.btocFlightBookingModel();
            const checkBooking = yield model.getSingleFlightBooking({
                user_id,
                id: Number(id),
            });
            if (!checkBooking.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const getSegments = yield model.getFlightSegment(Number(id));
            const getTraveler = yield model.getFlightTraveler(Number(id));
            getTraveler.forEach((item) => {
                if (item.gender === "M") {
                    item.gender = "Male";
                }
                if (item.gender === "F") {
                    item.gender = "Female";
                }
            });
            // const sabre_response:any = await postRequest(GET_BOOKING_ENDPOINT, {
            //   confirmationId: checkBooking[0].pnr_code,
            // });
            const ticket_model = this.Model.flightTicketIssueModel();
            const ticket_issue_data = yield ticket_model.getSingleIssueTicket(Number(id));
            const ticket_issue_segment_data = yield ticket_model.getTicketSegment(Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, checkBooking[0]), { segments: getSegments, traveler: getTraveler, ticket: ticket_issue_data.length
                        ? { ticket_issue_data, ticket_issue_segment_data }
                        : null }),
            };
        });
    }
    // cancel flight booking
    cancelFlightBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const flightBookingModel = this.Model.btocFlightBookingModel();
            const { booking_id } = req.params;
            let { id: user_id } = req.user;
            const checkFlightBooking = yield flightBookingModel.getSingleFlightBooking({
                user_id,
                id: Number(booking_id),
                status: "pending",
            });
            console.log({ checkFlightBooking });
            if (!checkFlightBooking.length) {
                return {
                    success: false,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                };
            }
            const { ticket_issue_last_time, pnr_code } = checkFlightBooking[0];
            yield flightBookingModel.updateBooking({ status: "cancelled", cancelled_by: user_id }, parseInt(booking_id));
            return {
                success: true,
                message: "Booking successfully canceled",
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
    // cancel flight booking
    cancelFlightBookingSabre(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const flightBookingModel = this.Model.btocFlightBookingModel();
            const { booking_id } = req.params;
            let { id: user_id } = req.user;
            const checkFlightBooking = yield flightBookingModel.getSingleFlightBooking({
                user_id,
                id: Number(booking_id),
                status: "pending",
            });
            if (!checkFlightBooking.length) {
                return {
                    success: false,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                };
            }
            const { ticket_issue_last_time, pnr_code } = checkFlightBooking[0];
            // Convert the database timestamp string to a Date object in UTC
            const databaseUTCTimestamp = Date.parse(ticket_issue_last_time);
            // Get the current UTC timestamp
            const currentUTCTimestamp = Date.now();
            if (currentUTCTimestamp < databaseUTCTimestamp) {
                const requestBody = this.RequestFormatter.cancelBookingReqBody(pnr_code);
                const response = yield this.request.postRequest(sabreApiEndpoints_1.CANCEL_BOOKING_ENDPOINT, requestBody);
                if (!response.errors) {
                    yield flightBookingModel.updateBooking({ status: "cancelled", cancelled_by: user_id }, parseInt(booking_id));
                    return {
                        success: true,
                        message: "Booking successfully canceled",
                        code: this.StatusCode.HTTP_OK,
                    };
                }
                else {
                    return {
                        success: false,
                        message: "PNR is not valid for cancel",
                        code: this.StatusCode.HTTP_NOT_FOUND,
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                };
            }
        });
    }
}
exports.default = flightBookingService;
