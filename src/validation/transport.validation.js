import Joi from 'joi';

export const createTransportValidator = (data) => {
  const transport = Joi.object({
    transport_type: Joi.string().valid('avtobus', 'poyezd', 'samolyot').required(),
    class: Joi.string().valid('ekonom', 'business', 'premium').required(),
    seat: Joi.number().integer().min(1).required()
  });

  return transport.validate(data);
};
export const updateTransportValidator = (data) => {
  const transport = Joi.object({
    transport_type: Joi.string().valid('avtobus', 'poyezd', 'samolyot').optional(),
    class: Joi.string().valid('ekonom', 'business', 'premium').optional(),
    seat: Joi.number().integer().min(1).optional()
  });

  return transport.validate(data);
};
