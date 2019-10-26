const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { joiErrors } = require('../handlers/errorHandlers');

const User = mongoose.model('User');

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

/**
 *  @swagger
 * /user/login:
 *   post:
 *     tags:
 *     - "user"
 *     summary: "Logar usuário"
 *     description: ""
 *     operationId: "loginUser"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Email e Senha do usuário a ser logado"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           email:
 *              type: "string"
 *              format: "email"
 *              minLength: 6
 *              maxLength: 128
 *           password:
 *              type: "string"
 *              format: "password"
 *     responses:
 *       200:
 *         description: "Login feito com sucesso"
 *         schema:
 *            type: "string"
 *         headers:
 *            AuthToken:
 *                $ref: "#/definitions/AuthToken"
 *       400:
 *         description: "Email ou Senha incorretos"
 */

exports.loginUser = async (req, res) => {
  // Validate user passed
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send(`Email ou Senha incorretos`);
  }

  // Check if password match
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Email ou Senha incorretos');
  }

  // Create and assign a jwt to the user that expires in one hour
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: '1h',
  });
  res.header('authToken', token);

  return res.send('Login feito com sucesso');
};

// Middleware function that verify if the token belongs to a registered user
exports.isLoggedIn = (req, res, next) => {
  const token = req.header('authToken');
  if (!token) {
    return res.status(401).send('Acesso Negado');
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    return res.status(400).send('Token Inválido');
  }
};
