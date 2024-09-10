import Joi from "joi";

export default class AdminBookingRequestValidator {
  //update validator
  public updateBookingRequestApplication = Joi.object({
    status: Joi.string().valid("approved", "cancelled").required(),
    note: Joi.string().optional(),
  });

  // manual issue ticket validator

  public manualTicketIssueValidator = Joi.object({
    pax_ticket: Joi.array().items(
      Joi.object({
        traveler_id: Joi.number().required(),
        ticket_number: Joi.string().required(),
      }).required()
    ),
  });
}
