const Joi = require('@hapi/joi');
const { joiErrors } = require('../handlers/errorHandlers');

const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .max(128)
      .email()
      .required()
      .error(errors => joiErrors(errors)),
    collegiate: Joi.string()
      .min(6)
      .max(128)
      .trim()
      .required()
      .error(errors => joiErrors(errors)),
    department: Joi.string()
      .min(6)
      .max(128)
      .trim()
      .required()
      .error(errors => joiErrors(errors)),
    password: Joi.string()
      .min(6)
      .trim()
      .required()
      .error(errors => joiErrors(errors)),
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .email()
      .required()
      .error(errors => joiErrors(errors)),
    password: Joi.string()
      .min(6)
      .trim()
      .required()
      .error(errors => joiErrors(errors)),
  });
  return schema.validate(data);
};

const emailValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .email()
      .required()
      .error(errors => joiErrors(errors)),
  });
  return schema.validate(data);
};

const passwordValidation = data => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .trim()
      .required()
      .error(errors => joiErrors(errors)),
  });
  return schema.validate(data);
};

const emailAsParamValidation = data => {
  const schema = Joi.string()
    .min(6)
    .email()
    .required()
    .error(errors => joiErrors(errors));
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
  emailAsParamValidation,
};
