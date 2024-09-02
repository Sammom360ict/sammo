import Joi from "joi";

export class AdminAgencyValidator {
  // create agency schema
  public createAgencySchema = Joi.object({
    agency_email: Joi.string().email().lowercase().required(),
    agency_phone: Joi.string().min(11).max(14).required(),
    agency_name: Joi.string().required(),
    // commission: Joi.number().min(0).max(12).required(),
    user_name: Joi.string().required(),
    user_email: Joi.string().email().lowercase().required(),
    user_password: Joi.string().required(),
    user_phone: Joi.string().min(11).max(14).required(),
  });

  // update agency schema
  public updateAgencySchema = Joi.object({
    email: Joi.string().email().lowercase().optional(),
    phone: Joi.string().min(11).max(14).optional(),
    agency_name: Joi.string().optional(),
    commission: Joi.number().min(0).optional(),
    status: Joi.number().valid("true", "false").optional(),
  });

  // create agency user schema
  public createAgencyUserSchema = Joi.object({
    agency_id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
    mobile_number: Joi.string().min(11).max(14).required(),
  });

  // update agency user schema
  public updateAgencyUserSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().lowercase().optional(),
    mobile_number: Joi.string().min(11).max(14).optional(),
    status: Joi.number().valid(0, 1).optional(),
  });

  //deposit to agency schema
  public depositToAgencySchema = Joi.object({
    agency_id: Joi.number().required(),
    amount: Joi.number().required(),
    details: Joi.string().optional(),
  });
}
