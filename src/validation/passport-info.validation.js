import Joi from "joi";

export const createPassportValidator=(data) => {
    const passportInfo=Joi.object({
        serial:Joi.string().required().trim().uppercase(),
        jshshir:Joi.string().required().length(14).trim(),
        full_name:Joi.string().required().trim(),
        customer_id:Joi.string().required().trim()
    })
    return passportInfo.validate(data);
}
export const updatePassportValidator=(data) => {
    const passportInfo=Joi.object({
        serial:Joi.string().trim().optional().uppercase(),
        jshshir:Joi.string().length(14).optional().trim(),
        full_name:Joi.string().trim().optional(),
        customer_id:Joi.string().trim().optional()
    })
    return passportInfo.validate(data);
}