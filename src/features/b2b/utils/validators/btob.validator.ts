import Joi from "joi";

export class BtobValidator {
  //visa application schema
  public applicationSchema = Joi.object({
    visa_id: Joi.number().required(),
    from_date: Joi.date().required(),
    to_date: Joi.date().required(),
    nationality: Joi.string().required(),
    residence: Joi.string().required(),
    traveler: Joi.number().required(),
    contact_email: Joi.string().required().email().lowercase(),
    contact_number: Joi.string().required().max(20),
    whatsapp_number: Joi.string().optional().max(20),
  });
}
