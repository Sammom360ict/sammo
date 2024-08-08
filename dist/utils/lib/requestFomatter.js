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
const rootModel_1 = __importDefault(require("../../models/rootModel"));
const dateTimeFormatter_1 = require("./dateTimeFormatter");
const flightUtils_1 = __importDefault(require("./flightUtils"));
class RequestFormatter {
    constructor() {
        this.model = new rootModel_1.default();
        // flight revalidate request body formatter
        this.revalidateReqBodyFormatter = (reqBody, retrieved_response) => {
            const OriginDestinationInformation = reqBody.OriginDestinationInformation.map((item, index) => {
                const req_depart_air = item.OriginLocation.LocationCode;
                const flights = [];
                const flight = retrieved_response.flights[index];
                const depart_time = flight.options[0].departure.time;
                const depart_air = flight.options[0].departure.airport_code;
                const utils = new flightUtils_1.default();
                if (req_depart_air === depart_air) {
                    for (const option of flight.options) {
                        const DepartureDateTime = utils.convertDateTime(option.departure.date, option.departure.time);
                        const ArrivalDateTime = utils.convertDateTime(option.arrival.date, option.arrival.time);
                        const flight_data = {
                            Number: option === null || option === void 0 ? void 0 : option.carrier.carrier_marketing_flight_number,
                            ClassOfService: 'V',
                            DepartureDateTime,
                            ArrivalDateTime,
                            Type: 'A',
                            OriginLocation: {
                                LocationCode: option === null || option === void 0 ? void 0 : option.departure.airport_code,
                            },
                            DestinationLocation: {
                                LocationCode: option === null || option === void 0 ? void 0 : option.arrival.airport_code,
                            },
                            Airline: {
                                Marketing: option === null || option === void 0 ? void 0 : option.carrier.carrier_marketing_code,
                                Operating: option === null || option === void 0 ? void 0 : option.carrier.carrier_operating_code,
                            },
                        };
                        flights.push(flight_data);
                    }
                    const origin_destination_info = {
                        RPH: item.RPH,
                        DepartureDateTime: utils.convertDateTime(item.DepartureDateTime, depart_time),
                        OriginLocation: item['OriginLocation'],
                        DestinationLocation: item['DestinationLocation'],
                        TPA_Extensions: {
                            Flight: flights,
                        },
                    };
                    return origin_destination_info;
                }
            });
            const PassengerTypeQuantity = reqBody.PassengerTypeQuantity.map((item) => {
                const passenger_info = {
                    Code: item.Code,
                    Quantity: item.Quantity,
                    TPA_Extensions: {
                        VoluntaryChanges: {
                            Match: 'Info',
                        },
                    },
                };
                return passenger_info;
            });
            const request_body = {
                OTA_AirLowFareSearchRQ: {
                    POS: {
                        Source: [
                            {
                                PseudoCityCode: 'U7ML',
                                RequestorID: {
                                    Type: '1',
                                    ID: '1',
                                    CompanyName: {
                                        Code: 'TN',
                                    },
                                },
                            },
                        ],
                    },
                    OriginDestinationInformation: OriginDestinationInformation,
                    TPA_Extensions: {
                        IntelliSellTransaction: {
                            CompressResponse: {
                                Value: false,
                            },
                            RequestType: {
                                Name: '200ITINS',
                            },
                        },
                    },
                    TravelerInfoSummary: {
                        AirTravelerAvail: [
                            {
                                PassengerTypeQuantity: PassengerTypeQuantity,
                            },
                        ],
                        SeatsRequested: [1],
                    },
                    TravelPreferences: {
                        TPA_Extensions: {
                            DataSources: {
                                NDC: 'Disable',
                                ATPCO: 'Enable',
                                LCC: 'Disable',
                            },
                            VerificationItinCallLogic: {
                                AlwaysCheckAvailability: true,
                                Value: 'L',
                            },
                        },
                    },
                    Version: '5',
                },
            };
            return request_body;
        };
        // revalidate request body formatter version 2.0
        this.newRevalidateReqBodyFormatterV2 = (reqBody) => {
            const OriginDestinationInformation = reqBody.OriginDestinationInformation.map((item) => {
                const flights = [];
                const flight = item.flight;
                const depart_time = flight[0].departure_time;
                const utils = new flightUtils_1.default();
                for (const option of flight) {
                    const DepartureDateTime = utils.convertDateTime(option.departure_date, option.departure_time);
                    const ArrivalDateTime = utils.convertDateTime(option.arrival_date, option.arrival_time);
                    const flight_data = {
                        Number: option.carrier_marketing_flight_number,
                        ClassOfService: 'V',
                        DepartureDateTime,
                        ArrivalDateTime,
                        Type: 'A',
                        OriginLocation: {
                            LocationCode: option.departure_airport_code,
                        },
                        DestinationLocation: {
                            LocationCode: option.arrival_airport_code,
                        },
                        Airline: {
                            Marketing: option.carrier_marketing_code,
                            Operating: option.carrier_operating_code,
                        },
                    };
                    flights.push(flight_data);
                }
                const origin_destination_info = {
                    RPH: String(item.RPH),
                    DepartureDateTime: utils.convertDateTime(item.DepartureDateTime, depart_time),
                    OriginLocation: item['OriginLocation'],
                    DestinationLocation: item['DestinationLocation'],
                    TPA_Extensions: {
                        Flight: flights,
                    },
                };
                return origin_destination_info;
            });
            const PassengerTypeQuantity = reqBody.PassengerTypeQuantity.map((item) => {
                const passenger_info = {
                    Code: item.Code,
                    Quantity: item.Quantity,
                    TPA_Extensions: {
                        VoluntaryChanges: {
                            Match: 'Info',
                        },
                    },
                };
                return passenger_info;
            });
            const request_body = {
                OTA_AirLowFareSearchRQ: {
                    POS: {
                        Source: [
                            {
                                PseudoCityCode: 'U7ML',
                                RequestorID: {
                                    Type: '1',
                                    ID: '1',
                                    CompanyName: {
                                        Code: 'TN',
                                    },
                                },
                            },
                        ],
                    },
                    OriginDestinationInformation: OriginDestinationInformation,
                    TPA_Extensions: {
                        IntelliSellTransaction: {
                            CompressResponse: {
                                Value: false,
                            },
                            RequestType: {
                                Name: '200ITINS',
                            },
                        },
                    },
                    TravelerInfoSummary: {
                        AirTravelerAvail: [
                            {
                                PassengerTypeQuantity: PassengerTypeQuantity,
                            },
                        ],
                        SeatsRequested: [1],
                    },
                    TravelPreferences: {
                        TPA_Extensions: {
                            DataSources: {
                                NDC: 'Disable',
                                ATPCO: 'Enable',
                                LCC: 'Disable',
                            },
                            VerificationItinCallLogic: {
                                AlwaysCheckAvailability: true,
                                Value: 'L',
                            },
                        },
                    },
                    Version: '5',
                },
            };
            return request_body;
        };
        // PNR REQUEST BODY
        this.pnrReqBody = (body, foundItem) => {
            const passengers = body.passengers;
            const passengerLength = passengers.length;
            const SecureFlight = [];
            const Service = [];
            const ContactNumber = [];
            const first_pass = passengers[0];
            Service.push({
                SSR_Code: 'CTCM',
                Text: first_pass.phone,
            });
            if (first_pass.address) {
                Service.push({
                    SSR_Code: 'OTHS',
                    Text: first_pass.address,
                });
            }
            if (first_pass.email) {
                Service.push({
                    SSR_Code: 'CTCE',
                    Text: first_pass.email,
                });
            }
            const Email = [];
            const PersonName = passengers.map((item, index) => {
                const name_number = index + 1 + '.1';
                const secure_fl_data = {
                    PersonName: {
                        NameNumber: name_number,
                        DateOfBirth: item.date_of_birth,
                        Gender: item.gender,
                        GivenName: item.mid_name,
                        Surname: item.sur_name,
                    },
                    SegmentNumber: 'A',
                    VendorPrefs: {
                        Airline: {
                            Hosted: false,
                        },
                    },
                };
                SecureFlight.push(secure_fl_data);
                ContactNumber.push({
                    NameNumber: name_number,
                    Phone: item.phone,
                    PhoneUseType: 'H',
                });
                if (item.email) {
                    Email.push({
                        NameNumber: name_number,
                        Address: item.email,
                        Type: 'CC',
                    });
                }
                const person = {
                    NameNumber: name_number,
                    NameReference: item.reference,
                    GivenName: item.mid_name,
                    Surname: item.sur_name,
                    PassengerType: item.type,
                };
                return person;
            });
            const flight = foundItem;
            let passenger_qty = 0;
            const PassengerType = flight.passengers.map((passenger) => {
                // passenger_qty += passenger.passengerNumber;
                passenger_qty += passenger.number;
                return {
                    // Code: passenger.passengerType,
                    Code: passenger.type,
                    Quantity: String(passenger_qty),
                };
            });
            console.log({ flight: flight.flights[0].options });
            // flight segments
            const FlightSegment = [];
            for (const item of flight.flights) {
                for (const option of item.options) {
                    const mar_code = option.carrier.carrier_marketing_code;
                    const segment = {
                        ArrivalDateTime: (0, dateTimeFormatter_1.dateTimeFormatter)(option.arrival.date, option.arrival.time),
                        DepartureDateTime: (0, dateTimeFormatter_1.dateTimeFormatter)(option.departure.date, option.departure.time),
                        FlightNumber: String(option.carrier.carrier_operating_flight_number),
                        NumberInParty: String(passengerLength),
                        ResBookDesigCode: 'Y',
                        Status: 'NN',
                        DestinationLocation: {
                            LocationCode: option.arrival.airport_code,
                        },
                        MarketingAirline: {
                            Code: mar_code,
                            FlightNumber: String(option.carrier.carrier_marketing_flight_number),
                        },
                        OriginLocation: {
                            LocationCode: option.departure.airport_code,
                        },
                    };
                    FlightSegment.push(segment);
                }
            }
            const request_body = {
                CreatePassengerNameRecordRQ: {
                    targetCity: 'U7ML',
                    haltOnAirPriceError: true,
                    TravelItineraryAddInfo: {
                        AgencyInfo: {
                            Address: {
                                AddressLine: 'T360 TOURS & TRAVEL',
                                CityName: 'DHAKA, BANGLADESH',
                                CountryCode: 'BD',
                                PostalCode: '1213',
                                StateCountyProv: {
                                    StateCode: 'NY',
                                },
                                StreetNmbr: '07TH H-74',
                            },
                            Ticketing: {
                                TicketType: '7TAW',
                            },
                        },
                        CustomerInfo: {
                            ContactNumbers: {
                                ContactNumber,
                            },
                            Email,
                            PersonName,
                        },
                    },
                    AirBook: {
                        HaltOnStatus: [
                            {
                                Code: 'HL',
                            },
                            {
                                Code: 'KK',
                            },
                            {
                                Code: 'LL',
                            },
                            {
                                Code: 'NN',
                            },
                            {
                                Code: 'NO',
                            },
                            {
                                Code: 'UC',
                            },
                            {
                                Code: 'US',
                            },
                        ],
                        OriginDestinationInformation: {
                            FlightSegment,
                        },
                        RedisplayReservation: {
                            NumAttempts: 5,
                            WaitInterval: 1000,
                        },
                    },
                    AirPrice: [
                        {
                            PriceRequestInformation: {
                                Retain: true,
                                OptionalQualifiers: {
                                    FOP_Qualifiers: {
                                        BasicFOP: {
                                            Type: 'CASH',
                                        },
                                    },
                                    PricingQualifiers: {
                                        PassengerType,
                                    },
                                },
                            },
                        },
                    ],
                    SpecialReqDetails: {
                        SpecialService: {
                            SpecialServiceInfo: {
                                SecureFlight,
                                Service,
                            },
                        },
                        AddRemark: {
                            RemarkInfo: {
                                Remark: [
                                    {
                                        Text: 'THE FARE IS NOT GUARANTEED UNTIL THE TICKET HAS BEEN ISSUED.',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'IF YOU DONT COMPLETE THE PAYMENT TRANSACTION WITH 30 MINUTES',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'OF THE RESERVATION, YOUR BOOKING WILL BE CANCELED AUTOMATICALLY.',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'YOUR TICKET IS NOT FULLY REFUNDABLE.',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'PLEASE REPORT TO THE AIRPORT 4 HOURS PRIOR TO EACH DEPARTURE FLIGHT',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'FOR TIME TO COMPLETE ALL FORMALITIES AND SECURITY CHECKS.',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'FOR DATE CHANGE CHARGES WILL BE APPLICABLE.',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'PLEASE RECONFIRM YOUR FLIGHT DETAILS 15 DAYS BEFORE OF DEPARTURE',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'CELL: 09638336699, EMAIL: sup.m360ict@gmail.com',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                    {
                                        Text: 'M360 ICT',
                                        Code: 'H',
                                        Type: 'Itinerary',
                                    },
                                ],
                            },
                        },
                    },
                    PostProcessing: {
                        EndTransaction: {
                            Source: {
                                ReceivedFrom: 'WEB',
                            },
                            Email: {
                                Ind: true,
                            },
                        },
                        RedisplayReservation: {
                            waitInterval: 1000,
                        },
                    },
                },
            };
            return request_body;
        };
        this.ticketIssueReqBody = (pnrId) => {
            return {
                AirTicketRQ: {
                    version: '1.3.0',
                    targetCity: 'U7ML',
                    DesignatePrinter: {
                        Printers: {
                            Ticket: {
                                CountryCode: 'BD',
                            },
                            Hardcopy: {
                                LNIATA: 'A96677',
                            },
                            InvoiceItinerary: {
                                LNIATA: 'A96677',
                            },
                        },
                    },
                    Itinerary: {
                        ID: pnrId,
                    },
                    Ticketing: [
                        {
                            MiscQualifiers: {
                                Commission: {
                                    Percent: 7,
                                },
                            },
                            PricingQualifiers: {
                                PriceQuote: [
                                    {
                                        Record: [
                                            {
                                                Number: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                    PostProcessing: {
                        EndTransaction: {
                            Source: {
                                ReceivedFrom: 'SABRE WEB',
                            },
                            Email: {
                                eTicket: {
                                    PDF: {
                                        Ind: true,
                                    },
                                    Ind: true,
                                },
                                PersonName: {
                                    NameNumber: '1.1',
                                },
                                Ind: true,
                            },
                        },
                    },
                },
            };
        };
        //cancel booking
        this.cancelBookingReqBody = (pnrId) => {
            return {
                confirmationId: pnrId,
                retrieveBooking: true,
                cancelAll: true,
                errorHandlingPolicy: "ALLOW_PARTIAL_CANCEL"
            };
        };
    }
    // flight search request body formatter
    flightSearch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // const commissionModel = this.model.AirlineCommissionModel();
            // const cappingAirlines: any[] = await commissionModel.getAllAirline();
            // if (!cappingAirlines.length) {
            //   return false;
            // }
            const reqBody = {
                OTA_AirLowFareSearchRQ: {
                    AvailableFlightsOnly: true,
                    OriginDestinationInformation: body.OriginDestinationInformation,
                    TravelerInfoSummary: {
                        AirTravelerAvail: [
                            {
                                PassengerTypeQuantity: body.PassengerTypeQuantity,
                            },
                        ],
                    },
                    POS: {
                        Source: [
                            {
                                PseudoCityCode: 'U7ML',
                                RequestorID: {
                                    CompanyName: {
                                        Code: 'TN',
                                    },
                                    ID: '1',
                                    Type: '1',
                                },
                            },
                        ],
                    },
                    ResponseType: 'GIR',
                    TPA_Extensions: {
                        IntelliSellTransaction: {
                            RequestType: {
                                Name: '200ITINS',
                            },
                        },
                    },
                    // AIRLINE CAPPING
                    TravelPreferences: {
                        // VendorPref: cappingAirlines,
                        TPA_Extensions: {
                            NumTrips: {
                                Number: 100,
                            },
                        },
                    },
                    Version: '4',
                },
            };
            return reqBody;
        });
    }
}
exports.default = RequestFormatter;
