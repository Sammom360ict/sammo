import Joi from "joi";

class ArticleValidator {
  public createArticlePayloadValidator = Joi.object({
    title: Joi.string().min(1).max(500).required(),
    description: Joi.string().required(),
    thumbnail_details: Joi.string().max(500).optional(),
  });

  public articleListFilterQueryValidator = Joi.object({
    title: Joi.string(),
    status: Joi.boolean(),
    deleted: Joi.boolean(),
    limit: Joi.number(),
    skip: Joi.number(),
  });

  public updateArticlePayloadValidator = Joi.object({
    title: Joi.string().min(1).max(500),
    description: Joi.string(),
    thumbnail_details: Joi.string().max(500),
    status: Joi.boolean(),
  });
}

export default ArticleValidator;
