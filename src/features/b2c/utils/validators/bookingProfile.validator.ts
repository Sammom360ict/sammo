import Joi from 'joi';

class BookingProfileValidator {
  public editProfile = Joi.object({
    username: Joi.string().min(1).max(255),
    first_name: Joi.string().min(1).max(255),
    last_name: Joi.string().min(1).max(255),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
  });
}

export default BookingProfileValidator;
