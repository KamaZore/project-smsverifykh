import Joi from "joi";

export const updateProfile = Joi.object({
  username: Joi.string().trim().min(3).max(30).optional(),
  email: Joi.string().trim().email().optional(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().min(1).max(72).required()
    .messages({ "any.required": "oldPassword is required" }),
  newPassword: Joi.string().min(8).max(72).required()
    .messages({ "any.required": "newPassword is required" }),
});

export const rentNumber = Joi.object({
  service: Joi.string().trim().min(1).max(20).required()
    .messages({ "any.required": "service is required" }),
  country: Joi.number().integer().min(1).max(999).required()
    .messages({ "any.required": "country is required" }),
  maxPrice: Joi.number().min(0).max(999).optional(),
  providerIds: Joi.string().trim().optional(),
  activationType: Joi.string().valid("SMS", "CALL_FLASH", "CALL_VOICE", "CALL_INTERACTIVE", "RENT_SMS").optional(),
});