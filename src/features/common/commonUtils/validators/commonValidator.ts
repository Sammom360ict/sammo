import Joi from 'joi';
import { SEND_OTP_TYPES } from './validatorConstants';

class CommonValidator {
  // common login input validator
  loginValidator = Joi.object({
    email: Joi.string().email().required().lowercase().messages({
      'string.base': 'Enter valid email',
      'string.email': 'Enter valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.base': 'Enter valid password',
      'string.min': 'Enter valid password minimum length 8',
      'any.required': 'Password is required',
    }),
  });

  //common register validator
  registerValidator = Joi.object({
    username: Joi.string().min(1).max(255).required(),
    first_name: Joi.string().min(1).max(255).required(),
    last_name: Joi.string().min(1).max(255).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    email: Joi.string().email().lowercase().min(1).max(255).required(),
    password: Joi.string().min(8).max(100).required(),
    phone_number: Joi.string().min(7).max(20).required(),
  });

  //single param validator
  public singleParamValidator = Joi.object({
    id: Joi.number().required(),
  });

  // single param string validator
  public singleParamStringValidator = (idFieldName: string = 'id') => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.string().required();
    return Joi.object(schemaObject);
  };

  // common forget password input validator
  commonForgetPassInputValidation = Joi.object({
    token: Joi.string().required().messages({
      'string.base': 'Provide valid token',
      'any.required': 'Token is required',
    }),
    email: Joi.string().email().optional().lowercase().messages({
      'string.base': 'Provide valid email',
      'string.email': 'Provide valid email',
    }),
    password: Joi.string().min(8).required().messages({
      'string.base': 'Provide valid password',
      'string.min': "Please provide valid password that's length must be min 8",
      'any.required': 'Password is required',
    }),
  });

  // send email otp input validator
  sendOtpInputValidator = Joi.object({
    type: Joi.string()
      .valid(...SEND_OTP_TYPES)
      .required()
      .messages({
        'string.base': 'Please enter valid OTP type',
        'any.only': 'Please enter valid OTP type',
        'any.required': 'OTP type is required',
      }),
    email: Joi.string().email().lowercase().required().messages({
      'string.base': 'Enter valid email address',
      'string.email': 'Enter valid email address',
      'any.required': 'Email is required',
    }),
  });

  // match email otp input validator
  matchEmailOtpInputValidator = Joi.object({
    email: Joi.string().email().lowercase().required().messages({
      'string.base': 'Enter valid email',
      'string.email': 'Enter valid email',
      'any.required': 'Email is required',
    }),
    otp: Joi.string().required().messages({
      'string.base': 'Enter valid otp',
      'any.required': 'OTP is required',
    }),
    type: Joi.string()
      .valid(...SEND_OTP_TYPES)
      .required()
      .messages({
        'string.base': 'Enter valid otp type',
        'any.only': 'Enter valid otp type',
        'any.required': 'OTP type is required',
      }),
  });

  // common change password input validation
  changePassInputValidation = Joi.object({
    old_password: Joi.string().min(8).required().messages({
      'string.base': 'Provide a valid old password',
      'string.min': 'Provide a valid old password minimum length is 8',
      'any.required': 'Old password is required',
    }),
    new_password: Joi.string().min(8).required().messages({
      'string.base': 'Provide a valid new password',
      'string.min': 'Provide a valid new password minimum length is 8',
      'any.required': 'New password is required',
    }),
  });

  //Create airport schema
  createAirportSchema = Joi.object({
    country_id: Joi.number().required(),
    name: Joi.string().max(500).required(),
    iata_code: Joi.string().max(12).required(),
    city: Joi.number().optional(),
  });

  //update airport schema
  updateAirportSchema = Joi.object({
    country_id: Joi.number().optional(),
    name: Joi.string().max(500).optional(),
    iata_code: Joi.string().max(12).optional(),
    city: Joi.number().optional(),
  });

  //airport filter
  airportFilterSchema = Joi.object({
    country_id: Joi.number().optional(),
    name: Joi.string().optional(),
    limit: Joi.number(),
    skip: Joi.number(),
  });

  //insert airlines
  insertAirlines = Joi.object({
    code: Joi.string().max(12).required(),
    name: Joi.string().max(500).required(),
  });

  //update airlines
  updateAirlines = Joi.object({
    code: Joi.string().max(12).optional(),
    name: Joi.string().max(500).optional(),
  });

  //airline filter
  airlineFilterSchema = Joi.object({
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    limit: Joi.number(),
    skip: Joi.number(),
  });

  //visa filter
  public visaListSchema = Joi.object({
    country_id: Joi.number().optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
  })
}

export default CommonValidator;
