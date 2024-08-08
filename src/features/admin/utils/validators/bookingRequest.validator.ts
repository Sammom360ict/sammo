import Joi from "joi";

export default class AdminBookingRequestValidator{
    //update validator
    public updateBookingRequestApplication = Joi.object({
        status:Joi.string().valid('Approved','Cancelled').required(),
        note: Joi.string().optional(),
    });
}