import Joi from "joi";
// flight booking validator schema
class FlightBookingValidator {
  // get all flight booking validator
  public getAllFlightBookingSchema = Joi.object({
    status: Joi.string().optional(),
    pnr: Joi.string().optional(),
    limit: Joi.string().optional(),
    skip: Joi.string().optional(),
    from_date: Joi.string().optional(),
    to_date: Joi.string().optional(),
  });

  public flightBookingQuerySchema = Joi.object({
    search_id: Joi.string().required(),
  });

  private passengerSchema = Joi.object({
    type: Joi.string()
      .valid(
        "ADT",
        "INF",
        "C02",
        "C03",
        "C04",
        "C05",
        "C06",
        "C07",
        "C08",
        "C09",
        "C10",
        "C11"
      )
      .required()
      .messages({
        "any.required": "Provide valid passenger type",
        "any.only": "Invalid passenger type",
      }),
    reference: Joi.string()
      .valid("MISS", "MASTER", "MS", "MR", "MRS")
      .required()
      .messages({
        "any.required": "Provide valid passenger reference",
      }),
    mid_name: Joi.string().required().messages({
      "any.required": "Provide valid mid name",
    }),
    sur_name: Joi.string().required().messages({
      "any.required": "Provide valid sur name",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Provide valid phone",
    }),
    date_of_birth: Joi.string().required().messages({
      "any.required": "Provide valid date of birth",
    }),
    gender: Joi.string()
      .valid("M", "F", "FI", "MI", "U", "UI", "X", "XI")
      .required()
      .messages({
        "any.required": "Provide valid gender",
        "any.only": "Invalid gender",
      }),
    email: Joi.string().email().required().messages({
      "any.required": "Provide valid email",
      "string.email": "Invalid email format",
    }),
    address: Joi.string().allow("").optional().messages({
      "string.empty": "Address must be a string",
    }),
    post_code: Joi.string().allow("").optional().messages({
      "string.empty": "post_code must be a string",
    }),
    city: Joi.string().allow("").optional().messages({
      "string.empty": "city must be a string",
    }),
    country: Joi.number().optional(),
    issuingCountryCode: Joi.string().allow("").optional(),
    residenceCountryCode: Joi.string().allow("").optional(),
    expiryDate: Joi.string().optional(),
    documentNumber: Joi.string().allow("").optional(),
    passport_number: Joi.string().optional(),
    passport_expire_date: Joi.string().optional(),
    save_information: Joi.boolean().optional(),
  });

  public pnrCreateSchema = Joi.object({
    flight_id: Joi.string().required().messages({
      "any.required": "Provide valid flight id",
    }),
    passengers: Joi.alternatives()
      .try(
        Joi.array().items(this.passengerSchema.required()).required(),
        Joi.string().custom((value, helpers) => {
          try {
            const parsedDeduction = JSON.parse(value);
            return parsedDeduction;
          } catch (error) {
            console.error("Error parsing passengers field:", error);
            return helpers.error("any.invalid");
          }
        })
      )
      .required(),
  });

  // TICKET ISSUE SCHEMA
  public ticketIssueSchema = Joi.object({
    booking_id: Joi.number().required().messages({
      "any.required": "Provide valid booking id",
    }),
  });
}

export default FlightBookingValidator;
