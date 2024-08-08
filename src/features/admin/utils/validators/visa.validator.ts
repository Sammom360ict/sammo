import Joi from "joi";

export class AdminVisaValidator {

    //create visa validator
    public CreateVisaSchema = Joi.object({
        country_id: Joi.number().required(),
        visa_fee: Joi.number().required().max(9999999999999999.99),
        processing_fee: Joi.number().required().max(9999999999999999.99),
        max_validity: Joi.number().required(),
        type: Joi.string().required(),
        description: Joi.string().optional(),
        stay_validity: Joi.number().required(),
        visa_mode: Joi.string().optional(),
        processing_type: Joi.string().optional(),
        documents_details: Joi.string().optional()
    });

    //get visa validator
    public GetVisaSchema = Joi.object({
        country_id: Joi.number().optional(),
        status: Joi.boolean().optional(),
        limit: Joi.number().optional(),
        skip: Joi.number().optional(),
    });

    //update visa validator
    public UpdateVisaSchema = Joi.object({
        country_id: Joi.number().optional(),
        visa_fee: Joi.number().optional().max(9999999999999999.99),
        processing_fee: Joi.number().optional().max(9999999999999999.99),
        max_validity: Joi.number().optional(),
        type: Joi.string().optional(),
        description: Joi.string().optional(),
        stay_validity: Joi.number().optional(),
        visa_mode: Joi.string().optional(),
        processing_type: Joi.string().optional(),
        documents_details: Joi.string().optional(),
        status: Joi.boolean().optional(),
    });

    //visa application filter schema
    public VisaApplicationFilterSchema = Joi.object({
        filter: Joi.string().optional(),
        from_date: Joi.date().optional(),
        to_date: Joi.date().optional(),
        limit: Joi.number().optional(),
        skip: Joi.number().optional(),
    });

    //visa tracking payload schema
    public VisaTrackingPayloadSchema = Joi.object({
        status: Joi.string().required(),
        details: Joi.string().required(),
    })

}