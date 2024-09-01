import Joi from "joi";

class AdminBtocValidator {
  //get all admin query validator
  public getAllAdminQueryValidator = Joi.object({
    filter: Joi.string(),
    role: Joi.number(),
    limit: Joi.number(),
    skip: Joi.number(),
    status: Joi.string(),
  });

  //get users filter validator
  public getUsersFilterValidator = Joi.object({
    filter: Joi.string(),
    status: Joi.boolean(),
    limit: Joi.number(),
    skip: Joi.number(),
  });

  //update user profile
  public editUserProfileValidator = Joi.object({
    username: Joi.string().min(1).max(255),
    first_name: Joi.string().min(1).max(255),
    last_name: Joi.string().min(1).max(255),
    gender: Joi.string().valid("Male", "Female", "Other"),
    status: Joi.boolean(),
  });
}

export default AdminBtocValidator;
