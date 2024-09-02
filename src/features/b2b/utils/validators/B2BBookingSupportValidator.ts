import Joi from "joi";

export class B2BBookingSupportValidator {
  //create support schema
  public createSupportSchema = Joi.object({
    booking_id: Joi.number().required(),
    support_type: Joi.string().required(),
    ticket_number: Joi.alternatives()
      .try(
        Joi.array()
          .items(
            Joi.object({
              traveler_id: Joi.number().required(),
              ticket_number: Joi.string().required(),
            }).required()
          )
          .required(),
        Joi.string().custom((value, helpers) => {
          try {
            const parsedDeduction = JSON.parse(value);
            return parsedDeduction;
          } catch (error) {
            console.error("Error parsing ticket number:", error);
            return helpers.error("any.invalid");
          }
        })
      )
      .required(),
    message: Joi.string().optional(),
  });
  //create message schema
  public createMessageSchema = Joi.object({
    message: Joi.string().optional(),
  });
  //close schema
  public closeSchema = Joi.object({
    status: Joi.string().valid("approved", "rejected").required(),
  });
}
