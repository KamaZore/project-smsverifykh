import Joi from "joi";

export const register = Joi.object({
  username: Joi.string().trim().min(3).max(30).required()
    .messages({ "any.required": "username is required" }),
  email: Joi.string().trim().email().required()
    .messages({ "any.required": "email is required" }),
  password: Joi.string().min(8).max(72).required()
    .messages({ "any.required": "password is required" }),
});

export const login = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({ "any.required": "email is required" }),
  password: Joi.string().min(1).max(72).required()
    .messages({ "any.required": "password is required" }),
});

export const refresh = Joi.object({
  refreshToken: Joi.string().trim().required()
    .messages({ "any.required": "refreshToken is required" }),
});