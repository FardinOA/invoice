import Joi from "joi";

// Joi schema for validating the user input
export const userValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please fill your name",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Please fill your email",
  }),
  address: Joi.string().trim(),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Please fill your password",
  }),
});

// Joi schema for validating the user login
export const userLoginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Please fill your email",
  }),
  address: Joi.string().trim(),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Please fill your password",
  }),
});
