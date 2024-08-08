import Joi from 'joi';

export default class BookingArticleValidator {
    public articleFilterQueryValidator = Joi.object({
        title: Joi.string(),
        limit: Joi.number(),
        skip: Joi.number(),
    });
}

