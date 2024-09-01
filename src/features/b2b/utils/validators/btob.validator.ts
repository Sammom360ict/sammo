import Joi from "joi";

export class BtobValidator {
  //insert deposit
  public insertDeposit = Joi.object({
    bank_name: Joi.string().optional(),
    amount: Joi.number().required(),
    payment_date: Joi.date().required(),
    remarks: Joi.string().optional(),
  });
}
