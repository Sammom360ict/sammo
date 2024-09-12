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
const uuid_1 = require("uuid");
const rootModel_1 = __importDefault(require("../../models/rootModel"));
const constants_1 = require("../miscellaneous/constants");
const customError_1 = __importDefault(require("./customError"));
const flightUtils_1 = __importDefault(require("./flightUtils"));
const lib_1 = __importDefault(require("./lib"));
class ResponseFormatter {
    constructor() {
        // flight search filter
        this.filterFlightSearch = (retrieveResponse, query) => {
            let results = retrieveResponse.results;
            // BY AIRLINE
            if (query.carrier_operating) {
                const airlines = query.carrier_operating.split(",");
                results = results.filter((item) => {
                    if (airlines.includes(item.carrier_code)) {
                        return item;
                    }
                });
            }
            //BY BAGGAGE
            if (query.baggage) {
                const baggage = query.baggage.split(",").map((b) => b.trim());
                let combinedResults = new Set();
                baggage.forEach((baggage_element) => {
                    const [baggage_count, baggage_unit] = baggage_element.split(" ");
                    const filteredResults = results.filter((item) => {
                        return item.passengers.some((passenger) => {
                            return passenger.availability.some((availability) => {
                                return (String(baggage_unit) === String(availability.baggage.unit) &&
                                    String(baggage_count) === String(availability.baggage.count));
                            });
                        });
                    });
                    filteredResults.forEach((result) => combinedResults.add(result));
                });
                results = Array.from(combinedResults);
            }
            //BY DEPARTURE TIME
            if (query.min_departure_time || query.max_departure_time) {
                if (query.min_departure_time) {
                    const min_time = query.min_departure_time.split(",");
                    let min_departure_time = min_time;
                    min_departure_time = min_departure_time.map((item) => item.replace(" ", "+"));
                    min_departure_time.forEach((element, index) => {
                        if (element !== "null") {
                            results = results.filter((item) => {
                                const date = new Date(item.flights[index].options[0].departure.date);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                const time = item.flights[index].options[0].departure.time;
                                const departureTime = `${year}-${month}-${day}T${time}`;
                                return element <= departureTime;
                            });
                        }
                    });
                }
                if (query.max_departure_time) {
                    // let max_departure_time = JSON.parse(query.max_departure_time);
                    const max_time = query.max_departure_time.split(",");
                    let max_departure_time = max_time;
                    max_departure_time = max_departure_time.map((item) => item.replace(" ", "+"));
                    max_departure_time.forEach((element, index) => {
                        if (element !== "null") {
                            results = results.filter((item) => {
                                const date = new Date(item.flights[index].options[0].departure.date);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                const time = item.flights[index].options[0].departure.time;
                                const departureTime = `${year}-${month}-${day}T${time}`;
                                return element >= departureTime;
                            });
                        }
                    });
                }
            }
            //BY ARRIVAL TIME
            if (query.min_arrival_time || query.max_arrival_time) {
                if (query.min_arrival_time) {
                    // let min_arrival_time = JSON.parse(query.min_arrival_time);
                    const min_time = query.min_arrival_time.split(",");
                    let min_arrival_time = min_time;
                    min_arrival_time = min_arrival_time.map((item) => item.replace(" ", "+"));
                    min_arrival_time.forEach((element, index) => {
                        if (element !== "null") {
                            results = results.filter((item) => {
                                const date = new Date(item.flights[index].options[item.flights[index].options.length - 1].arrival.date);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                const time = item.flights[index].options[item.flights[index].options.length - 1].arrival.time;
                                const arrivalTime = `${year}-${month}-${day}T${time}`;
                                return element <= arrivalTime;
                            });
                        }
                    });
                }
                if (query.max_arrival_time) {
                    // let max_arrival_time = JSON.parse(query.max_arrival_time);
                    const max_time = query.max_arrival_time.split(",");
                    let max_arrival_time = max_time;
                    max_arrival_time = max_arrival_time.map((item) => item.replace(" ", "+"));
                    max_arrival_time.forEach((element, index) => {
                        if (element !== "null") {
                            results = results.filter((item) => {
                                const date = new Date(item.flights[index].options[item.flights[index].options.length - 1].arrival.date);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                const time = item.flights[index].options[item.flights[index].options.length - 1].arrival.time;
                                const arrivalTime = `${year}-${month}-${day}T${time}`;
                                return element >= arrivalTime;
                            });
                        }
                    });
                }
            }
            if (query.sort_by) {
                switch (query.sort_by) {
                    case "CHEAPEST":
                        results = results.sort((item1, item2) => item1.fare.payable - item2.fare.payable);
                        console.log("sorted res", results[0]);
                        break;
                    case "FASTEST":
                        results = results.sort((item1, item2) => item1.flights[0].elapsed_time - item2.flights[0].elapsed_time);
                        break;
                    case "EARLIEST":
                        results = results.sort((item1, item2) => lib_1.default.getTimeValue(item1.flights[0].options[0].departure.time) -
                            lib_1.default.getTimeValue(item2.flights[0].options[0].departure.time));
                        break;
                    default:
                        break;
                }
            }
            // BY STOPPAGE
            if (query.stoppage) {
                console.log({ stoppage: query.stoppage });
                const stoppage_filter = JSON.parse(query.stoppage);
                stoppage_filter.forEach((allowedStoppages, ind) => {
                    if (allowedStoppages === null) {
                        return;
                    }
                    results = results.filter((item) => {
                        if (item.flights[ind]) {
                            return allowedStoppages.includes(item.flights[ind].stoppage);
                        }
                        return false;
                    });
                    console.log({ results });
                });
            }
            // BY PRICE RANGE
            if (query.max_price || query.min_price) {
                const max = Number(query.max_price);
                const min = Number(query.min_price || 0);
                results = results.filter((flight) => flight.fare.total_price >= min);
                if (max) {
                    results = results.filter((flight) => flight.fare.total_price <= max);
                }
            }
            // BY NON REFUNDABLE
            if (query.refundable) {
                let booleanValue = query.refundable === "true" ? true : false;
                results = results.filter((item) => {
                    if (item.refundable[0].refundable === booleanValue) {
                        return item;
                    }
                });
            }
            const count = results.length;
            const page = query.page || "1";
            const size = query.size || "50";
            // PAGINATION
            results = this.FlightUtils.getLimitOffset(results, page, size);
            const updatedResponse = {
                count,
                data: Object.assign(Object.assign({}, retrieveResponse), { results }),
            };
            return updatedResponse;
        };
        // revalidate response formatter
        this.revalidate = (data, reqBody) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const conn = this.Model.commonModel();
            const airCapConn = this.Model.AirlineCommissionModel();
            const OriginDest = reqBody.OriginDestinationInformation;
            const scheduleDesc = [];
            for (const item of data.scheduleDescs) {
                const dAirport = yield conn.getAirport(item.departure.airport);
                const AAirport = yield conn.getAirport(item.arrival.airport);
                const DCity = yield conn.getCity(item.departure.city);
                const ACity = yield conn.getCity(item.arrival.city);
                const marketing_airline = yield conn.getAirlines(item.carrier.marketing);
                const aircraft = yield conn.getAircraft(item.carrier.equipment.code);
                let operating_airline = marketing_airline;
                if (item.carrier.marketing !== item.carrier.operating) {
                    operating_airline = yield conn.getAirlines(item.carrier.operating);
                }
                const departure = {
                    airport_code: item.departure.airport,
                    city_code: item.departure.city,
                    airport: dAirport,
                    city: DCity,
                    country: item.departure.country,
                    terminal: item.departure.terminal,
                    time: item.departure.time,
                    date: "",
                    date_adjustment: item.departure.dateAdjustment,
                };
                const arrival = {
                    airport: AAirport,
                    city: ACity,
                    airport_code: item.arrival.airport,
                    city_code: item.arrival.city,
                    country: item.arrival.country,
                    time: item.arrival.time,
                    terminal: item.arrival.terminal,
                    date: "",
                    date_adjustment: item.arrival.dateAdjustment,
                };
                const carrier = {
                    carrier_marketing_code: item.carrier.marketing,
                    carrier_marketing_airline: marketing_airline.name,
                    carrier_marketing_logo: marketing_airline.logo,
                    carrier_marketing_flight_number: item.carrier.marketingFlightNumber,
                    carrier_operating_code: item.carrier.operating,
                    carrier_operating_airline: operating_airline.name,
                    carrier_operating_logo: operating_airline.logo,
                    carrier_operating_flight_number: item.carrier.operatingFlightNumber,
                    carrier_aircraft_code: aircraft.code,
                    carrier_aircraft_name: aircraft.name,
                };
                const new_item = {
                    id: item.id,
                    e_ticketable: item.eTicketable,
                    elapsedTime: item.elapsedTime,
                    stopCount: item.stopCount,
                    message: item.message,
                    message_type: item.messageType,
                    total_miles_flown: item.totalMilesFlown,
                    departure,
                    arrival,
                    carrier,
                };
                scheduleDesc.push(new_item);
            }
            // legDesc
            const legDesc = data.legDescs.map((leg) => {
                const schedules = leg.schedules;
                const options = [];
                for (const schedule of schedules) {
                    const founded = scheduleDesc.find((item) => item.id === schedule.ref);
                    if (founded) {
                        options.push(Object.assign(Object.assign({}, founded), { departureDateAdjustment: schedule.departureDateAdjustment }));
                    }
                }
                return {
                    id: leg.id,
                    elapsed_time: leg.elapsedTime,
                    options,
                };
            });
            const itineraryGroup = data.itineraryGroups[0];
            const legDescriptions = itineraryGroup.groupDescription.legDescriptions;
            const from_city = legDescriptions[0].departureLocation;
            const to_city = legDescriptions[0].arrivalLocation;
            // if (legDescriptions.length > 1) {
            //   to_city = legDescriptions[legDescriptions.length - 1].arrivalLocation;
            // } else {
            //   to_city = legDescriptions[0].arrivalLocation;
            // }
            const itineraries = [];
            for (let i = 0; i < itineraryGroup.itineraries.length; i++) {
                const itinerary = itineraryGroup.itineraries[i];
                const fare = itinerary.pricingInformation[0].fare;
                const passenger_lists = [];
                const refundable = [];
                for (const passenger of fare.passengerInfoList) {
                    const passenger_info = passenger.passengerInfo;
                    refundable.push({
                        type: passenger_info.passengerType,
                        refundable: !passenger_info.nonRefundable,
                    });
                    const segmentDetails = [];
                    for (let i = 0; i < passenger_info.fareComponents.length; i++) {
                        const pfd = passenger_info.fareComponents[i];
                        const segments = [];
                        for (let j = 0; j < pfd.segments.length; j++) {
                            const segd = pfd.segments[j];
                            const segment = segd.segment;
                            const meal_type = lib_1.default.getMeal(segment.mealCode || "");
                            const cabin_type = lib_1.default.getCabin(segment.cabinCode || "");
                            segments.push({
                                id: j + 1,
                                name: `Segment-${j + 1}`,
                                meal_type: meal_type === null || meal_type === void 0 ? void 0 : meal_type.name,
                                meal_code: meal_type === null || meal_type === void 0 ? void 0 : meal_type.code,
                                cabin_code: cabin_type === null || cabin_type === void 0 ? void 0 : cabin_type.code,
                                cabin_type: cabin_type === null || cabin_type === void 0 ? void 0 : cabin_type.name,
                                booking_code: segment.bookingCode,
                                available_seat: segment.seatsAvailable,
                                available_break: segment.availabilityBreak,
                                available_fare_break: segment.fareBreakPoint,
                            });
                        }
                        const baggage = passenger_info.baggageInformation[i];
                        let newBaggage = {};
                        if (baggage) {
                            const allowance_id = (_a = baggage === null || baggage === void 0 ? void 0 : baggage.allowance) === null || _a === void 0 ? void 0 : _a.ref;
                            newBaggage = data.baggageAllowanceDescs.find((all_item) => all_item.id === allowance_id);
                        }
                        segmentDetails.push({
                            id: i + 1,
                            from_airport: pfd.beginAirport,
                            to_airport: pfd.endAirport,
                            segments,
                            baggage: {
                                id: newBaggage === null || newBaggage === void 0 ? void 0 : newBaggage.id,
                                unit: newBaggage.unit || "pieces",
                                count: newBaggage.weight || newBaggage.pieceCount,
                            },
                        });
                    }
                    const new_passenger = {
                        type: passenger_info.passengerType,
                        number: passenger_info.passengerNumber,
                        non_refundable: passenger_info.nonRefundable,
                        availability: segmentDetails,
                        fare: {
                            total_fare: passenger_info.passengerTotalFare.totalFare,
                            tax: passenger_info.passengerTotalFare.totalTaxAmount,
                            base_fare: passenger_info.passengerTotalFare.equivalentAmount,
                        },
                    };
                    passenger_lists.push(new_passenger);
                }
                const legsDesc = this.FlightUtils.newGetLegsDesc(itinerary.legs, legDesc, OriginDest);
                const validatingCarrier = yield conn.getAirlines(fare.validatingCarrierCode);
                const comCheck = yield airCapConn.getSingle(fare.validatingCarrierCode);
                const new_fare = {
                    commission: 0,
                    base_fare: 0,
                    discount: 0,
                    ait: 0,
                    payable: 0,
                    total_price: 0,
                    total_tax: 0,
                };
                const ait = Math.round((fare.totalFare.totalPrice / 100) * 0.3);
                let commissionPer = 0.0;
                if (comCheck.length) {
                    const { from_dac_commission, to_dac_commission, soto_commission, domestic_commission, } = comCheck[0];
                    if (constants_1.BD_AIRPORT.includes(from_city) && constants_1.BD_AIRPORT.includes(to_city)) {
                        commissionPer = domestic_commission;
                    }
                    else {
                        if (constants_1.BD_AIRPORT.includes(from_city)) {
                            commissionPer = from_dac_commission;
                        }
                        else if (constants_1.BD_AIRPORT.includes(to_city)) {
                            commissionPer = to_dac_commission;
                        }
                        else {
                            commissionPer = soto_commission;
                        }
                    }
                }
                new_fare["commission"] = commissionPer;
                const commissionAmount = (fare.totalFare.equivalentAmount * commissionPer) / 100;
                new_fare["base_fare"] = fare.totalFare.equivalentAmount;
                new_fare["discount"] = commissionAmount;
                new_fare["ait"] = ait;
                new_fare["payable"] = fare.totalFare.totalPrice - commissionAmount + ait;
                new_fare["total_price"] = fare.totalFare.totalPrice + ait;
                new_fare["total_tax"] = fare.totalFare.totalTaxAmount;
                const itinery = {
                    // flight_id: uuidv4(),
                    fare: new_fare,
                    refundable,
                    carrier_code: fare.validatingCarrierCode,
                    carrier_name: validatingCarrier.name,
                    carrier_logo: validatingCarrier.logo,
                    ticket_last_date: fare.lastTicketDate,
                    ticket_last_time: fare.lastTicketTime,
                    leg_descriptions: legDescriptions,
                    flights: legsDesc,
                    passengers: passenger_lists,
                };
                itineraries.push(itinery);
            }
            // ADD AIRLINE DETAILS
            const updatedItineraries = yield Promise.all(itineraries.map((item) => __awaiter(this, void 0, void 0, function* () {
                const flights = item.flights;
                const updatedFlights = yield Promise.all(flights.map((item2) => __awaiter(this, void 0, void 0, function* () {
                    const options = item2.options;
                    const stoppage = options.length - 1;
                    return Object.assign(Object.assign({ stoppage }, item2), { options });
                })));
                return Object.assign(Object.assign({}, item), { fare: item.fare, flights: updatedFlights });
            })));
            const isDomesticFlight = updatedItineraries[0].leg_descriptions.every((leg) => constants_1.BD_AIRPORT.includes(leg.departureLocation) &&
                constants_1.BD_AIRPORT.includes(leg.arrivalLocation))
                ? true
                : false;
            return Object.assign(Object.assign({}, updatedItineraries[0]), { isDomesticFlight });
        });
        // PNR RESPONSE FORMATTER
        this.pnrResponseFormatter = (response) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d;
            try {
                const createPassenger = response === null || response === void 0 ? void 0 : response.CreatePassengerNameRecordRS;
                const status = (_b = createPassenger === null || createPassenger === void 0 ? void 0 : createPassenger.ApplicationResults) === null || _b === void 0 ? void 0 : _b.status;
                console.log({ PNR_STATUS: status });
                const pnrId = (_c = createPassenger === null || createPassenger === void 0 ? void 0 : createPassenger.ItineraryRef) === null || _c === void 0 ? void 0 : _c.ID;
                // const airlinePnr = createPassenger?.
                const FlightSegment = createPassenger.AirBook.OriginDestinationOption.FlightSegment;
                let PriceQuote = undefined;
                if (createPassenger === null || createPassenger === void 0 ? void 0 : createPassenger.AirPrice) {
                    PriceQuote = (_d = createPassenger === null || createPassenger === void 0 ? void 0 : createPassenger.AirPrice[0]) === null || _d === void 0 ? void 0 : _d.PriceQuote;
                }
                const SolutionInformation = PriceQuote === null || PriceQuote === void 0 ? void 0 : PriceQuote.MiscInformation.SolutionInformation;
                const HeaderInformation = PriceQuote === null || PriceQuote === void 0 ? void 0 : PriceQuote.MiscInformation.HeaderInformation[0];
                const PersonName = createPassenger.TravelItineraryRead.TravelItinerary.CustomerInfo
                    .PersonName;
                return {
                    LastTicketingDate: HeaderInformation === null || HeaderInformation === void 0 ? void 0 : HeaderInformation.LastTicketingDate,
                    DepartureDate: HeaderInformation === null || HeaderInformation === void 0 ? void 0 : HeaderInformation.DepartureDate,
                    pnrId,
                    PersonName,
                    SolutionInformation,
                    FlightSegment,
                };
            }
            catch (error) {
                throw new customError_1.default(error.message, 500);
            }
        });
        this.Model = new rootModel_1.default();
        this.FlightUtils = new flightUtils_1.default();
    }
    // Flight search
    flightSearch(trx, data, reqBody
    // commission: number
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const conn = this.Model.commonModel(trx);
            const airCapConn = this.Model.AirlineCommissionModel(trx);
            if (data.statistics.itineraryCount === 0) {
                throw new customError_1.default("Flight not found", 404);
            }
            const OriginDest = reqBody.OriginDestinationInformation;
            const scheduleDesc = [];
            for (const item of data.scheduleDescs) {
                const dAirport = yield conn.getAirport(item.departure.airport);
                const AAirport = yield conn.getAirport(item.arrival.airport);
                const DCity = yield conn.getCity(item.departure.city);
                const ACity = yield conn.getCity(item.arrival.city);
                const marketing_airline = yield conn.getAirlines(item.carrier.marketing);
                const aircraft = yield conn.getAircraft(item.carrier.equipment.code);
                let operating_airline = marketing_airline;
                if (item.carrier.marketing !== item.carrier.operating) {
                    operating_airline = yield conn.getAirlines(item.carrier.operating);
                }
                const departure = {
                    airport_code: item.departure.airport,
                    city_code: item.departure.city,
                    airport: dAirport,
                    city: DCity,
                    country: item.departure.country,
                    terminal: item.departure.terminal,
                    time: item.departure.time,
                    date: "",
                    date_adjustment: item.departure.dateAdjustment,
                };
                const arrival = {
                    airport: AAirport,
                    city: ACity,
                    airport_code: item.arrival.airport,
                    city_code: item.arrival.city,
                    country: item.arrival.country,
                    time: item.arrival.time,
                    terminal: item.arrival.terminal,
                    date: "",
                    date_adjustment: item.arrival.dateAdjustment,
                };
                const carrier = {
                    carrier_marketing_code: item.carrier.marketing,
                    carrier_marketing_airline: marketing_airline.name,
                    carrier_marketing_logo: marketing_airline.logo,
                    carrier_marketing_flight_number: item.carrier.marketingFlightNumber,
                    carrier_operating_code: item.carrier.operating,
                    carrier_operating_airline: operating_airline.name,
                    carrier_operating_logo: operating_airline.logo,
                    carrier_operating_flight_number: item.carrier.operatingFlightNumber,
                    carrier_aircraft_code: aircraft.code,
                    carrier_aircraft_name: aircraft.name,
                };
                const new_item = {
                    id: item.id,
                    e_ticketable: item.eTicketable,
                    elapsedTime: item.elapsedTime,
                    stopCount: item.stopCount,
                    message: item.message,
                    message_type: item.messageType,
                    total_miles_flown: item.totalMilesFlown,
                    departure,
                    arrival,
                    carrier,
                };
                scheduleDesc.push(new_item);
            }
            const legDesc = data.legDescs.map((leg) => {
                const schedules = leg.schedules;
                const options = [];
                for (const schedule of schedules) {
                    const founded = scheduleDesc.find((item) => item.id === schedule.ref);
                    if (founded) {
                        options.push(Object.assign(Object.assign({}, founded), { departureDateAdjustment: schedule.departureDateAdjustment }));
                    }
                }
                return {
                    id: leg.id,
                    elapsed_time: leg.elapsedTime,
                    options,
                };
            });
            const itineraryGroup = data.itineraryGroups[0];
            const legDescriptions = itineraryGroup.groupDescription.legDescriptions;
            const from_city = legDescriptions[0].departureLocation;
            const to_city = legDescriptions[0].arrivalLocation;
            // if (legDescriptions.length > 1) {
            //   to_city = legDescriptions[legDescriptions.length - 1].arrivalLocation;
            // } else {
            //   to_city = legDescriptions[0].arrivalLocation;
            // }
            const itineraries = [];
            for (let i = 0; i < itineraryGroup.itineraries.length; i++) {
                const itinerary = itineraryGroup.itineraries[i];
                const fare = itinerary.pricingInformation[0].fare;
                const passenger_lists = [];
                const refundable = [];
                // const flight_class: {
                //   type: string;
                //   cabin_type: string | undefined;
                //   booking_code: string | undefined;
                // }[] = [];
                for (const passenger of fare.passengerInfoList) {
                    const passenger_info = passenger.passengerInfo;
                    // const fare_segment =
                    // passenger_info.fareComponents[0].segments[0].segment;
                    // let baggage: any = {};
                    refundable.push({
                        type: passenger_info.passengerType,
                        refundable: !passenger_info.nonRefundable,
                    });
                    const segmentDetails = [];
                    // if (passenger_info.baggageInformation) {
                    //   const baggageInformation = passenger_info.baggageInformation[0];
                    //   const allowance_id = baggageInformation?.allowance?.ref;
                    //   baggage = data.baggageAllowanceDescs.find(
                    //     (all_item) => all_item.id === allowance_id
                    //   );
                    // }
                    // const meal_type = Lib.getMeal(fare_segment?.mealCode || '');
                    // const cabin_type = Lib.getCabin(fare_segment?.cabinCode || '');
                    // flight_class.push({
                    //   type: passenger_info.passengerType,
                    //   booking_code: fare_segment.bookingCode,
                    //   cabin_type: cabin_type?.name,
                    // });
                    for (let i = 0; i < passenger_info.fareComponents.length; i++) {
                        const pfd = passenger_info.fareComponents[i];
                        const segments = [];
                        for (let j = 0; j < pfd.segments.length; j++) {
                            const segd = pfd.segments[j];
                            const segment = segd.segment;
                            const meal_type = lib_1.default.getMeal((segment === null || segment === void 0 ? void 0 : segment.mealCode) || "");
                            const cabin_type = lib_1.default.getCabin((segment === null || segment === void 0 ? void 0 : segment.cabinCode) || "");
                            segments.push({
                                id: j + 1,
                                name: `Segment-${j + 1}`,
                                meal_type: meal_type === null || meal_type === void 0 ? void 0 : meal_type.name,
                                meal_code: meal_type === null || meal_type === void 0 ? void 0 : meal_type.code,
                                cabin_code: cabin_type === null || cabin_type === void 0 ? void 0 : cabin_type.code,
                                cabin_type: cabin_type === null || cabin_type === void 0 ? void 0 : cabin_type.name,
                                booking_code: segment === null || segment === void 0 ? void 0 : segment.bookingCode,
                                available_seat: segment === null || segment === void 0 ? void 0 : segment.seatsAvailable,
                                available_break: segment === null || segment === void 0 ? void 0 : segment.availabilityBreak,
                                available_fare_break: segment === null || segment === void 0 ? void 0 : segment.fareBreakPoint,
                            });
                        }
                        let newBaggage = {};
                        if (passenger_info.baggageInformation) {
                            const baggage = passenger_info.baggageInformation[i];
                            if (baggage) {
                                const allowance_id = (_a = baggage === null || baggage === void 0 ? void 0 : baggage.allowance) === null || _a === void 0 ? void 0 : _a.ref;
                                newBaggage = data.baggageAllowanceDescs.find((all_item) => all_item.id === allowance_id);
                            }
                        }
                        segmentDetails.push({
                            id: i + 1,
                            from_airport: pfd.beginAirport,
                            to_airport: pfd.endAirport,
                            segments,
                            baggage: (newBaggage === null || newBaggage === void 0 ? void 0 : newBaggage.id)
                                ? {
                                    id: newBaggage === null || newBaggage === void 0 ? void 0 : newBaggage.id,
                                    unit: newBaggage.unit || "pieces",
                                    count: newBaggage.weight || newBaggage.pieceCount,
                                }
                                : {
                                    id: 1,
                                    unit: "N/A",
                                    count: "N/A",
                                },
                        });
                    }
                    const new_passenger = {
                        type: passenger_info.passengerType,
                        number: passenger_info.passengerNumber,
                        non_refundable: passenger_info.nonRefundable,
                        availability: segmentDetails,
                        fare: {
                            total_fare: passenger_info.passengerTotalFare.totalFare,
                            tax: passenger_info.passengerTotalFare.totalTaxAmount,
                            base_fare: passenger_info.passengerTotalFare.equivalentAmount,
                        },
                    };
                    passenger_lists.push(new_passenger);
                }
                const legsDesc = this.FlightUtils.newGetLegsDesc(itinerary.legs, legDesc, OriginDest);
                const validatingCarrier = yield conn.getAirlines(fare.validatingCarrierCode);
                const comCheck = yield airCapConn.getSingle(fare.validatingCarrierCode);
                const new_fare = {
                    commission: 0,
                    base_fare: 0,
                    discount: 0,
                    ait: 0,
                    payable: 0,
                    total_price: 0,
                    total_tax: 0,
                };
                const ait = Math.round((fare.totalFare.totalPrice / 100) * 0.3);
                let commissionPer = 0.0;
                if (comCheck.length) {
                    const { from_dac_commission, to_dac_commission, soto_commission, domestic_commission, } = comCheck[0];
                    if (constants_1.BD_AIRPORT.includes(from_city) && constants_1.BD_AIRPORT.includes(to_city)) {
                        commissionPer = domestic_commission;
                    }
                    else {
                        if (constants_1.BD_AIRPORT.includes(from_city)) {
                            commissionPer = from_dac_commission;
                        }
                        else if (constants_1.BD_AIRPORT.includes(to_city)) {
                            commissionPer = to_dac_commission;
                        }
                        else {
                            commissionPer = soto_commission;
                        }
                    }
                }
                new_fare["commission"] = commissionPer;
                const commissionAmount = (fare.totalFare.equivalentAmount * commissionPer) / 100;
                new_fare["base_fare"] = fare.totalFare.equivalentAmount;
                new_fare["discount"] = commissionAmount;
                new_fare["ait"] = ait;
                new_fare["payable"] = fare.totalFare.totalPrice - commissionAmount + ait;
                new_fare["total_price"] = fare.totalFare.totalPrice + ait;
                new_fare["total_tax"] = fare.totalFare.totalTaxAmount;
                const itinery = {
                    flight_id: (0, uuid_1.v4)(),
                    fare: new_fare,
                    refundable,
                    carrier_code: fare.validatingCarrierCode,
                    carrier_name: validatingCarrier.name,
                    carrier_logo: validatingCarrier.logo,
                    ticket_last_date: fare.lastTicketDate,
                    ticket_last_time: fare.lastTicketTime,
                    leg_descriptions: legDescriptions,
                    flights: legsDesc,
                    passengers: passenger_lists,
                };
                itineraries.push(itinery);
            }
            // FILTER OPTIONS
            const airlines = [];
            const priceRange = [];
            let total_stoppage = [];
            const baggage = [];
            let minDepartureTime = [];
            let maxDepartureTime = [];
            let minArrivalTime = [];
            let maxArrivalTime = [];
            let depDest = [];
            // ADD AIRLINE DETAILS
            const updatedItineraries = yield Promise.all(itineraries.map((item) => __awaiter(this, void 0, void 0, function* () {
                const flights = item.flights;
                const updatedFlights = yield Promise.all(flights.map((item2) => __awaiter(this, void 0, void 0, function* () {
                    const options = item2.options;
                    const stoppage = options.length - 1;
                    return Object.assign(Object.assign({ stoppage }, item2), { options });
                })));
                priceRange.push(item.fare.payable);
                const isAirlinePushed = airlines.find((airline) => airline.airline_code === item.carrier_code);
                if (!isAirlinePushed) {
                    const price = itineraries.reduce((lowest, item2) => {
                        if (item2.carrier_code === item.carrier_code &&
                            (lowest === 0 || item2.fare.payable < lowest)) {
                            return item2.fare.payable;
                        }
                        else {
                            return lowest;
                        }
                    }, 0);
                    airlines.push({
                        airline_code: item.carrier_code,
                        airline_logo: item.carrier_logo,
                        airline_name: item.carrier_name,
                        price,
                    });
                }
                //baggage
                const baggageInfo = yield Promise.all(item.passengers.map((element) => __awaiter(this, void 0, void 0, function* () {
                    element.availability.map((element2) => __awaiter(this, void 0, void 0, function* () {
                        if (!(element2.baggage.count === "N/A" ||
                            element2.baggage.unit === "N/A")) {
                            const baggage_element = element2.baggage.count + " " + element2.baggage.unit;
                            if (!baggage.includes(baggage_element)) {
                                baggage.push(baggage_element);
                            }
                        }
                    }));
                })));
                //departure time
                flights.forEach((element, ind) => {
                    const date = new Date(element.options[0].departure.date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const time = element.options[0].departure.time;
                    const departureTime = `${year}-${month}-${day}T${time}`;
                    if (minDepartureTime[ind] === undefined ||
                        departureTime < minDepartureTime[ind]) {
                        minDepartureTime[ind] = departureTime;
                        depDest[ind] = element.options[0].departure.city;
                    }
                    if (maxDepartureTime[ind] === undefined ||
                        departureTime > maxDepartureTime[ind]) {
                        maxDepartureTime[ind] = departureTime;
                    }
                });
                //arrival time
                flights.forEach((element, ind) => {
                    const date = new Date(element.options[element.options.length - 1].arrival.date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const time = element.options[element.options.length - 1].arrival.time;
                    const arrivalTime = `${year}-${month}-${day}T${time}`;
                    if (minArrivalTime[ind] === undefined ||
                        arrivalTime < minArrivalTime[ind]) {
                        minArrivalTime[ind] = arrivalTime;
                    }
                    if (maxArrivalTime[ind] === undefined ||
                        arrivalTime > maxArrivalTime[ind]) {
                        maxArrivalTime[ind] = arrivalTime;
                    }
                });
                //new stoppage filter
                flights.forEach((element, ind) => {
                    if (!total_stoppage[ind]) {
                        total_stoppage[ind] = new Set();
                    }
                    total_stoppage[ind].add(element.options.length - 1);
                });
                return Object.assign(Object.assign({}, item), { fare: item.fare, flights: updatedFlights });
            })));
            for (let key in total_stoppage) {
                total_stoppage[key] = Array.from(total_stoppage[key]);
            }
            const departure_time = minDepartureTime.map((_, ind) => {
                return {
                    min: minDepartureTime[ind],
                    max: maxDepartureTime[ind],
                    airport: depDest[ind],
                };
            });
            const arrival_time = minArrivalTime.map((_, ind) => {
                return {
                    min: minArrivalTime[ind],
                    max: maxArrivalTime[ind],
                };
            });
            const filter = {
                total_stoppage,
                price_rage: {
                    max: Math.max(...priceRange),
                    min: Math.min(...priceRange),
                },
                airlines,
                baggage,
                departure_time: departure_time,
                arrival_time: arrival_time,
            };
            const updatedData = { filter, results: updatedItineraries };
            return [updatedData, data.statistics.itineraryCount];
        });
    }
}
exports.default = ResponseFormatter;
