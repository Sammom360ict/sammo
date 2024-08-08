import Joi from 'joi';

class BookingProfileValidator {
  public editProfile = Joi.object({
    name: Joi.string().min(1).max(255),
    mobile_number: Joi.string().min(1).max(20),
  });
}

export default BookingProfileValidator;
