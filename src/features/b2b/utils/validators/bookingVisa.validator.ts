import Joi from "joi";

export class VisaValidator {
  //valid traveler types
  private traveler_types = [
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
    "C11",
  ];
  //valid traveler titles
  private traveler_titles = ["MISS", "MASTER", "MS", "MR", "MRS"];

  //visa application traveler schema
  private travelerSchema = Joi.object({
    type: Joi.string()
      .valid(...this.traveler_types)
      .required(),
    title: Joi.string()
      .valid(...this.traveler_titles)
      .required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    passport_number: Joi.string().required(),
    passport_expiry_date: Joi.date().required(),
    city: Joi.string().optional(),
    country_id: Joi.number().optional(),
    address: Joi.string().optional(),
    passport_type: Joi.string().optional(),
  });

  //visa application schema
  public applicationSchema = Joi.object({
    visa_id: Joi.number().required(),
    from_date: Joi.date().required(),
    to_date: Joi.date().required(),
    nationality: Joi.string().allow("").optional(),
    residence: Joi.string().required().allow("").optional(),
    traveler: Joi.number().required(),
    contact_email: Joi.string().required().email().lowercase(),
    contact_number: Joi.string().required().max(20),
    whatsapp_number: Joi.string().optional().max(20),
    passengers: Joi.array().items(this.travelerSchema.required()).required(),
  });
}
