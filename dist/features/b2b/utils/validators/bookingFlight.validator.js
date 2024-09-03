"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class BookingFlightValidator {
    constructor() {
        // dependent schema start ==============================================================================
        // Cabin Pref Schema
        this.cabinPrefSchema = joi_1.default.object({
            Cabin: joi_1.default.string().valid("P", "F", "J", "C", "S", "Y").required(),
            PreferLevel: joi_1.default.string().required(),
        });
        // Location schema
        this.locationSchema = joi_1.default.object({
            LocationCode: joi_1.default.string().required().uppercase().messages({
                "any.required": "Provide valid location",
            }),
        });
        /// TPA Schema
        this.tpaSchema = joi_1.default.object({
            CabinPref: this.cabinPrefSchema.required().messages({
                "any.required": "CabinPref is required",
            }),
        });
        // Origin Destination Schema
        this.originDestSchema = joi_1.default.object({
            RPH: joi_1.default.string().required().messages({
                "any.required": "Provide valid RPH",
            }),
            DepartureDateTime: joi_1.default.string()
                .pattern(new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/))
                .required()
                .messages({
                "any.required": "Provide valid Departure date time",
                "string.pattern.base": "Invalid departure timestamp",
            }),
            OriginLocation: this.locationSchema.required().messages({
                "any.required": "Provide valid origin location",
            }),
            DestinationLocation: this.locationSchema.required().messages({
                "any.required": "Provide valid destination location",
            }),
            TPA_Extensions: this.tpaSchema.required().messages({
                "any.required": "TPA Extensions is required",
            }),
        });
        // Passenger Type Schema
        this.passengerTypeSchema = joi_1.default.object({
            Code: joi_1.default.string().required().messages({
                "any.required": "Provide valid passenger",
            }),
            Quantity: joi_1.default.number().integer().required().messages({
                "any.required": "Provide valid quantity",
                "number.integer": "Quantity must be an integer",
            }),
        });
        // dependent schema end ==============================================================================
        // Flight search validator end
        this.flightSearchSchema = joi_1.default.object({
            OriginDestinationInformation: joi_1.default.array()
                .items(this.originDestSchema.required())
                .required()
                .messages({
                "any.required": "Provide valid Origin destination data",
            }),
            PassengerTypeQuantity: joi_1.default.array()
                .items(this.passengerTypeSchema.required())
                .required()
                .messages({
                "any.required": "Provide valid passenger code and quantity data",
            }),
        });
        // Flight filter schema
        this.flightFilterSchema = joi_1.default.object({
            carrier_operating: joi_1.default.string().optional(),
            min_price: joi_1.default.number().optional(),
            max_price: joi_1.default.number().optional(),
            page: joi_1.default.number().optional(),
            size: joi_1.default.number().optional(),
            refundable: joi_1.default.string().optional(),
            search_id: joi_1.default.string().required(),
            stoppage: joi_1.default.string().optional(),
            aircraft: joi_1.default.string().optional(),
            elapsed_time_min: joi_1.default.string().optional(),
            departure_timing: joi_1.default.string().optional(),
            arrival_timing: joi_1.default.string().optional(),
            sort_by: joi_1.default.string().optional(),
            baggage: joi_1.default.string().optional(),
            min_departure_time: joi_1.default.string().optional(),
            max_departure_time: joi_1.default.string().optional(),
            min_arrival_time: joi_1.default.string().optional(),
            max_arrival_time: joi_1.default.string().optional(),
        });
        // Flight revalidate schema
        this.flightRevalidateSchema = joi_1.default.object({
            flight_id: joi_1.default.string().required(),
        });
        //FLIGHT SCHEMA FOR REVALIDATE
        this.flightInfoSchema = joi_1.default.object({
            departure_time: joi_1.default.string().required(),
            departure_date: joi_1.default.string().required(),
            arrival_time: joi_1.default.string().required(),
            arrival_date: joi_1.default.string().required(),
            carrier_marketing_flight_number: joi_1.default.number().required(),
            departure_airport_code: joi_1.default.string().required(),
            arrival_airport_code: joi_1.default.string().required(),
            carrier_marketing_code: joi_1.default.string().required(),
            carrier_operating_code: joi_1.default.string().required(),
        });
        //ORIGIN DESTINATION INFORMATION SCHEMA FOR REVALIDATE
        this.originDestinationInfoSchema = joi_1.default.object({
            RPH: joi_1.default.string().required(),
            DepartureDateTime: joi_1.default.string()
                .pattern(new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/))
                .required(),
            OriginLocation: this.locationSchema.required(),
            DestinationLocation: this.locationSchema.required(),
            flight: joi_1.default.array().items(this.flightInfoSchema.required()).required(),
            TPA_Extensions: this.tpaSchema.optional().messages({
                "any.required": "TPA Extensions is required",
            }),
        });
        //FLIGHT REVALIDATE SCHEMA V2
        this.flightRevalidateSchemaV2 = joi_1.default.object({
            OriginDestinationInformation: joi_1.default.array()
                .items(this.originDestinationInfoSchema.required())
                .required(),
            PassengerTypeQuantity: joi_1.default.array()
                .items(this.passengerTypeSchema.required())
                .required(),
        });
    }
}
exports.default = BookingFlightValidator;
