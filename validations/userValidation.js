import { Joi } from "express-validation";

export const userValidation = {
  register: {
    body: Joi.object({
      first_name: Joi.string()
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
        .required()
        .messages({
          "string.pattern.base": "First name must only contain letters.",
          "string.empty": "First name is required.",
        }),
      last_name: Joi.string()
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
        .required()
        .messages({
          "string.pattern.base": "Last name must only contain letters.",
          "string.empty": "Last name is required.",
        }),
      date_of_birth: Joi.date().less("now").required().messages({
        "date.less": "Date of birth must be a valid past date.",
        "date.base": "Date of birth must be a valid date.",
      }),
      username: Joi.string().required().messages({
        "string.empty": "Username is required.",
      }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required.",
      }),
      avatar: Joi.string().required().messages({
        "string.empty": "Avatar is required.",
      }),
    }),
  },
  login: {
    body: Joi.object({
      username: Joi.string().required().messages({
        "string.empty": "Username is required.",
      }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required.",
      }),
    }),
  },
};
