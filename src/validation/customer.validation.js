import Joi from "joi";

export const createCustomerValidation = (data) => {
  const customer = Joi.object({
    email: Joi.string().email().required(),
    phone_number: Joi.string()
      .pattern(/^\+[1-9]\d{1,14}$/)
      .required()
  });
  return customer.validate(data);
};

export const updateCustomerValidation = (data) => {
  const customer = Joi.object({
    email: Joi.string().email(),
    phone_number: Joi.string()
      .pattern(/^\+[1-9]\d{1,14}$/)
  });
  return customer.validate(data);
};
