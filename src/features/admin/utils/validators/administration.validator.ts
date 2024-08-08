import Joi from "joi";

class AdministrationValidator {

    //Role validation
    public createRole = Joi.object({
        role_name: Joi.string().min(1).max(150).required(),
    });

    //Permission validation
    public createPermission = Joi.object({
        permission_name: Joi.string().min(1).max(255).required(),
    });

    //Update role permissions validator
    public updateRolePermissions = Joi.object({
        add_permissions: Joi.array().items(Joi.number().integer()),
        remove_permissions: Joi.array().items(Joi.number().integer()),
    })

    //create admin
    public createAdmin = Joi.object({
        username: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        gender: Joi.string().required().valid('Male', 'Female', 'Other'),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).required(),
        phone_number: Joi.string().required(),
        role_id: Joi.number().required(),
    })

    //get all admin query validator
    public getAllAdminQueryValidator = Joi.object({
        filter: Joi.string(),
        role: Joi.number(),
        limit: Joi.number(),
        skip: Joi.number(),
        status: Joi.string(),
    })

    //update admin
    public updateAdmin = Joi.object({
        username: Joi.string(),
        first_name: Joi.string(),
        last_name: Joi.string(),
        gender: Joi.string().valid('Male', 'Female', 'Other'),
        phone_number: Joi.string(),
        role_id: Joi.number(),
        status:Joi.boolean(),
    })

    //get users filter validator
    public getUsersFilterValidator = Joi.object({
        filter:Joi.string(),
        status:Joi.boolean(),
        limit:Joi.number(),
        skip:Joi.number(),
    })

    //update user profile
    public editUserProfileValidator = Joi.object({
        username: Joi.string().min(1).max(255),
        first_name: Joi.string().min(1).max(255),
        last_name: Joi.string().min(1).max(255),
        gender: Joi.string().valid('Male', 'Female', 'Other'),
        status:Joi.boolean(),
      });


    //create city
    public createCityValidator = Joi.object({
        country_id: Joi.number().required(),
        name: Joi.string().required(),
      });

}

export default AdministrationValidator;