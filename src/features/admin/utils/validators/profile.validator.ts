import Joi from 'joi';

class ProfileValidator {
    public editProfile = Joi.object({
        username: Joi.string().optional().messages({
            'string.base': 'Username must be a string',
            'any.required': 'Username is required'
        }),
        first_name: Joi.string().optional().messages({
            'string.base': 'First name must be a string',
            'any.required': 'First name is required'
        }),
        last_name: Joi.string().optional().messages({
            'string.base': 'Last name must be a string',
            'any.required': 'Last name is required'
        }),
        gender: Joi.string().valid('Male', 'Female', 'Other').optional().messages({
            'any.only': 'Gender must be Male, Female, or Other'
        })
    });
}


export default ProfileValidator;
