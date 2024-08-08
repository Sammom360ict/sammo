import Joi from 'joi';

export class AirlineCommissionValidator {
  // create airline validator
  public createAirlinesCommissionSchema = Joi.object({
    airline_code: Joi.string().required(),
    soto_commission: Joi.number().optional(),
    from_dac_commission: Joi.number().required(),
    to_dac_commission: Joi.number().required(),
    capping: Joi.number().valid(0, 1).required(),
    soto_allowed: Joi.number().valid(0, 1).required(),
    domestic_commission: Joi.number().optional(),
  });

  // get airline validator
  public getAirlinesCommissionSchema = Joi.object({
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    updated_at: Joi.string().optional(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
  });

  // update airline validator
  public updateAirlinesCommissionSchema = Joi.object({
    soto_commission: Joi.number().optional(),
    from_dac_commission: Joi.number().optional(),
    to_dac_commission: Joi.number().optional(),
    capping: Joi.number().valid(0, 1).optional(),
    soto_allowed: Joi.number().valid(0, 1).optional(),
    domestic_commission: Joi.number().optional(),
  });
}
