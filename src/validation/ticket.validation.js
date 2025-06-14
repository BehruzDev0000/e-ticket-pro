import Joi from "joi";

export const createTicketValidator=(data)=>{
    const ticket= Joi.object({
        transport_id:Joi.string().required(),
        from:Joi.string().required().trim(),
        to:Joi.string().required().trim(),
        price:Joi.number().required().min(0),
        departure:Joi.date().required(),
        arrival:Joi.date().required(),
        customer_id:Joi.string().required()
    })
    return ticket.validate(data);
}
export const updateTicketValidator=(data)=>{
    const ticket= Joi.object({
        transport_id:Joi.string().optional(),
        from:Joi.string().optional().trim(),
        to:Joi.string().optional().trim(),
        price:Joi.number().optional().min(0),
        departure:Joi.date().optional(),
        arrival:Joi.date().optional(),
        customer_id:Joi.string().optional()
    })
    return ticket.validate(data);
}