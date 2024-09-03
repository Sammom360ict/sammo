import Joi from "joi";

export default class BookingFlightValidator {
  // dependent schema start ==============================================================================

  // Cabin Pref Schema
  private cabinPrefSchema = Joi.object({
    Cabin: Joi.string().valid("P", "F", "J", "C", "S", "Y").required(),
    PreferLevel: Joi.string().required(),
  });

  // Location schema
  private locationSchema = Joi.object({
    LocationCode: Joi.string().required().uppercase().messages({
      "any.required": "Provide valid location",
    }),
  });

  /// TPA Schema
  private tpaSchema = Joi.object({
    CabinPref: this.cabinPrefSchema.required().messages({
      "any.required": "CabinPref is required",
    }),
  });

  // Origin Destination Schema
  private originDestSchema = Joi.object({
    RPH: Joi.string().required().messages({
      "any.required": "Provide valid RPH",
    }),
    DepartureDateTime: Joi.string()
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
  private passengerTypeSchema = Joi.object({
    Code: Joi.string().required().messages({
      "any.required": "Provide valid passenger",
    }),
    Quantity: Joi.number().integer().required().messages({
      "any.required": "Provide valid quantity",
      "number.integer": "Quantity must be an integer",
    }),
  });
  // dependent schema end ==============================================================================

  // Flight search validator end
  public flightSearchSchema = Joi.object({
    OriginDestinationInformation: Joi.array()
      .items(this.originDestSchema.required())
      .required()
      .messages({
        "any.required": "Provide valid Origin destination data",
      }),
    PassengerTypeQuantity: Joi.array()
      .items(this.passengerTypeSchema.required())
      .required()
      .messages({
        "any.required": "Provide valid passenger code and quantity data",
      }),
  });

  // Flight filter schema
  public flightFilterSchema = Joi.object({
    carrier_operating: Joi.string().optional(),
    min_price: Joi.number().optional(),
    max_price: Joi.number().optional(),
    page: Joi.number().optional(),
    size: Joi.number().optional(),
    refundable: Joi.string().optional(),
    search_id: Joi.string().required(),
    stoppage: Joi.string().optional(),
    aircraft: Joi.string().optional(),
    elapsed_time_min: Joi.string().optional(),
    departure_timing: Joi.string().optional(),
    arrival_timing: Joi.string().optional(),
    sort_by: Joi.string().optional(),
    baggage: Joi.string().optional(),
    min_departure_time: Joi.string().optional(),
    max_departure_time: Joi.string().optional(),
    min_arrival_time: Joi.string().optional(),
    max_arrival_time: Joi.string().optional(),
  });

  // Flight revalidate schema
  public flightRevalidateSchema = Joi.object({
    flight_id: Joi.string().required(),
  });

  //FLIGHT SCHEMA FOR REVALIDATE
  public flightInfoSchema = Joi.object({
    departure_time: Joi.string().required(),
    departure_date: Joi.string().required(),
    arrival_time: Joi.string().required(),
    arrival_date: Joi.string().required(),
    carrier_marketing_flight_number: Joi.number().required(),
    departure_airport_code: Joi.string().required(),
    arrival_airport_code: Joi.string().required(),
    carrier_marketing_code: Joi.string().required(),
    carrier_operating_code: Joi.string().required(),
  });
  //ORIGIN DESTINATION INFORMATION SCHEMA FOR REVALIDATE
  public originDestinationInfoSchema = Joi.object({
    RPH: Joi.string().required(),
    DepartureDateTime: Joi.string()
      .pattern(new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/))
      .required(),
    OriginLocation: this.locationSchema.required(),
    DestinationLocation: this.locationSchema.required(),
    flight: Joi.array().items(this.flightInfoSchema.required()).required(),
    TPA_Extensions: this.tpaSchema.optional().messages({
      "any.required": "TPA Extensions is required",
    }),
  });

  //FLIGHT REVALIDATE SCHEMA V2
  public flightRevalidateSchemaV2 = Joi.object({
    OriginDestinationInformation: Joi.array()
      .items(this.originDestinationInfoSchema.required())
      .required(),
    PassengerTypeQuantity: Joi.array()
      .items(this.passengerTypeSchema.required())
      .required(),
  });
}
