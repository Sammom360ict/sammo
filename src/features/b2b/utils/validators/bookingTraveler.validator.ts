import Joi from 'joi';

export default class BookingTravelerValidator {

  // create traveler schema
  public create = Joi.object({
    type: Joi.string()
      .valid(
        'ADT',
        'INF',
        'C02',
        'C03',
        'C04',
        'C05',
        'C06',
        'C07',
        'C08',
        'C09',
        'C10',
        'C11'
      )
      .required(),
    reference: Joi.string()
      .valid('MISS', 'MASTER', 'MS', 'MR', 'MRS')
      .required(),
    mid_name: Joi.string().required(),
    sur_name: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    passport_number: Joi.string().optional(),
    passport_expire_date: Joi.date().optional(),
    city: Joi.string().optional(),
    country: Joi.number().optional(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().required(),
    frequent_flyer_airline: Joi.string().optional(),
    frequent_flyer_number: Joi.string().optional(),
    gender: Joi.string().optional(),
  });

  // get traveler schema
  public get = Joi.object({
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    name: Joi.string().optional(),
    status: Joi.number().optional()
  });


  // update traveler schema
  public update = Joi.object({
    type: Joi.string()
      .valid(
        'ADT',
        'INF',
        'C02',
        'C03',
        'C04',
        'C05',
        'C06',
        'C07',
        'C08',
        'C09',
        'C10',
        'C11'
      )
      .optional(),
    reference: Joi.string()
      .valid('MISS', 'MASTER', 'MS', 'MR', 'MRS')
      .optional(),
    mid_name: Joi.string().optional(),
    sur_name: Joi.string().optional(),
    date_of_birth: Joi.date().optional(),
    passport_number: Joi.string().optional(),
    passport_expire_date: Joi.date().optional(),
    city: Joi.string().optional(),
    country: Joi.number().optional(),
    email: Joi.string().email().lowercase().optional(),
    phone: Joi.string().optional(),
    frequent_flyer_airline: Joi.string().optional(),
    frequent_flyer_number: Joi.string().optional(),
    gender: Joi.string().optional(),
    status: Joi.number().valid(1,0).optional()
  });
}
