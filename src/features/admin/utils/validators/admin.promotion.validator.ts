import Joi from "joi";

export class AdminPrmotionValidator {
  // create promo code validator
  public createPromoCodeValidator = Joi.object({
    code: Joi.string().required(),
    discount_percentage: Joi.number().required(),
    max_usage: Joi.number().required(),
    expiry_date: Joi.date().optional(),
  });

  // update promo code validator
  public updatePromoCodeValidator = Joi.object({
    code: Joi.string().allow("").optional(),
    status: Joi.number().valid(0, 1).optional(),
    discount_percentage: Joi.number().optional(),
    max_usage: Joi.number().optional(),
    expiry_date: Joi.date().optional(),
  });

  // create offer validator
  public createOfferValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    promo_code_id: Joi.number().optional(),
  });

  // update offer validator
  public updateOfferValidator = Joi.object({
    title: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    start_date: Joi.date().allow("").optional(),
    end_date: Joi.date().allow("").optional(),
    promo_code_id: Joi.number().allow("").optional(),
    status: Joi.number().valid(0, 1).optional(),
  });
}
