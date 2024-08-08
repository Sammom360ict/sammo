import Joi from "joi";

export class BtoBSubAgencyValidator{
    //create schema
    public createSchema = Joi.object({
        agency_name: Joi.string().required(),
        agency_email: Joi.string().email().lowercase().required(),
        agency_phone: Joi.string().max(20).optional(),
        commission: Joi.number().optional(),
        user_name: Joi.string().required(),
        user_email: Joi.string().email().lowercase().required(),
        user_password: Joi.string().min(8).required(),
        user_phone: Joi.string().max(20).optional()
    });
}