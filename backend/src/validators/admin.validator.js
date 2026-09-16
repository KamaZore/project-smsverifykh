import Joi from "joi";

export const adminLogin = Joi.object({
  username: Joi.string().trim().min(3).max(50).required()
    .messages({ "any.required": "username is required" }),
  password: Joi.string().min(1).max(72).required()
    .messages({ "any.required": "password is required" }),
});

export const updateStatus = Joi.object({
  status: Joi.string().valid("active", "suspended", "banned").required()
    .messages({ "any.required": "status is required" }),
});

export const adjustBalance = Joi.object({
  amount: Joi.number().precision(4).required()
    .messages({ "any.required": "amount is required" }),
  description: Joi.string().trim().max(255).allow("").optional(),
});

export const updateHeroKey = Joi.object({
  apiKey: Joi.string().trim().min(8).max(128).required()
    .messages({ "any.required": "apiKey is required" }),
});

export const updateHeroAccount = Joi.object({
  accountId: Joi.string().trim().allow("").optional(),
  email: Joi.string().trim().email().allow("").optional(),
  username: Joi.string().trim().min(1).max(100).allow("").optional(),
  password: Joi.string().trim().min(1).max(128).allow("").optional(),
});

export const stockCount = Joi.object({
  service: Joi.string().trim().min(1).max(20).required()
    .messages({ "any.required": "service is required" }),
});