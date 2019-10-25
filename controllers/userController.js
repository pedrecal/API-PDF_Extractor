const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const { joiErrors } = require('../handlers/errorHandlers');

const User = mongoose.model('User');

const registerValidation = data => {
  const schema = Joi.object().keys({
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

/**
 * @swagger
 *
 * definitions:
 *   AuthToken:
 *     description: "Token de usuário autenticado"
 *     type: "string"
 *     format: "Bearer Auth"
 *   User:
 *    type: "object"
 *    properties:
 *      id:
 *        type: "string"
 *        format: "ObjectId"
 *        readOnly: true
 *      email:
 *        type: "string"
 *        format: "email"
 *        minLength: 6
 *        maxLength: 128
 *      collegiate:
 *        type: "string"
 *        minLength: 6
 *        maxLength: 128
 *      department:
 *        type: "string"
 *        minLength: 6
 *        maxLength: 128
 *      password:
 *        type: "string"
 *        format: "password"
 *      creationDate:
 *        type: "string"
 *        format: "Date"
 *        readOnly: true
 *      resetPasswordToken:
 *        type: "string"
 *        readOnly: true
 *      resetPasswordExpires:
 *        type: "string"
 *        format: "Date"
 *        readOnly: true
 */

/**
 *  @swagger
 * /user/register:
 *   post:
 *     tags:
 *     - "user"
 *     summary: "Criar novo usuário"
 *     description: ""
 *     operationId: "registerUser"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto do tipo Usuário"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/User"
 *     responses:
 *       200:
 *         description: "Usuário salvo com sucesso"
 *       400:
 *         description: "Ocorreu um erro ao cadastrar o usuário. Verifique o corpo da resposta."
 */

exports.registerUser = async (req, res, next) => {
  // Validate user passed
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res
      .status(400)
      .send(`Já existe um usuário cadastrado com este email`);
  }

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    email: req.body.email,
    collegiate: req.body.collegiate,
    department: req.body.department,
    password: hashPassword,
  });
  try {
    // Save new user to mongo
    const savedUser = await user.save();
    // TODO Remove
    console.log(savedUser);
    res.status(200).send('Usuário salvo com sucesso');
  } catch (e) {
    res.status(400).send(e);
  }
  // next(); // pass to authController.login
};
