const Joi = require('@hapi/joi');

const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .email()
      .required(),
    name: Joi.string()
      .min(6)
      .trim()
      .required(),
    password: Joi.string()
      .min(6)
      .trim()
      .required(),
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .trim()
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
