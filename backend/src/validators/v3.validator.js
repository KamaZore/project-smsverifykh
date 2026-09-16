import Joi from "joi";

export const getPricesV3 = Joi.object({
  service: Joi.string().trim().min(1).max(20).required()
    .messages({ "any.required": "service is required" }),
  country: Joi.number().integer().min(1).max(999).required()
    .messages({ "any.required": "country is required" }),
});

export const getOffers = Joi.object({
  services: Joi.string().trim().optional(),
  countries: Joi.string().trim().optional(),
});
