import Joi from "joi";

export const getFreePrices = Joi.object({
  service: Joi.string().trim().min(1).max(20).required()
    .messages({ "any.required": "service is required" }),
  country: Joi.number().integer().min(1).max(999).required()
    .messages({ "any.required": "country is required" }),
});

export const getPricesV2 = Joi.object({
  service: Joi.string().trim().min(1).max(20).required()
    .messages({ "any.required": "service is required" }),
  country: Joi.number().integer().min(1).max(999).required()
    .messages({ "any.required": "country is required" }),
});

export const getNumberV2 = Joi.object({
  service: Joi.string().trim().min(1).max(20).required()
    .messages({ "any.required": "service is required" }),
  country: Joi.number().integer().min(1).max(999).required()
    .messages({ "any.required": "country is required" }),
  multiple: Joi.boolean().valid("true", "false", "1", "0", true, false).optional(),
  maxPrice: Joi.number().min(0).max(999).optional(),
  providerIds: Joi.string().trim().optional(),
  exceptProviderIds: Joi.string().trim().optional(),
  ref: Joi.string().trim().max(50).optional(),
  activationType: Joi.string().valid("SMS", "CALL_FLASH", "CALL_VOICE", "CALL_INTERACTIVE", "RENT_SMS").optional(),
});

export const getStatusV2 = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({ "any.required": "id is required" }),
});

export const setStatusV2 = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({ "any.required": "id is required" }),
  status: Joi.string().valid("get_sms", "refuse", "used").required()
    .messages({ "any.required": "status is required" }),
});
