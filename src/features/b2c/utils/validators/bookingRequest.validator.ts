import Joi from "joi";

export default class BookingRequestValidator{
    //traveler schema
    private travelerSchema = Joi.object({
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
        title: Joi.string()
          .valid('MISS', 'MASTER', 'MS', 'MR', 'MRS')
          .required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        passport_number: Joi.string().optional(),
        passport_expiry_date: Joi.date().optional(),
        city_id: Joi.number().required(),
        email: Joi.string().email().lowercase().required(),
        phone: Joi.string().required(),
        frequent_flyer_airline: Joi.string().optional(),
        frequent_flyer_number: Joi.string().optional(),
      });

      //create traveler schema
      public createTravelerSchema = Joi.object({
        flight_id: Joi.string().required().messages({
          'any.required': 'Provide valid flight id',
        }),
        passengers: Joi.array()
          .items(this.travelerSchema.required())
          .required(),
      });
}