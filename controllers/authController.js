const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const User = mongoose.model('User');

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
  res.header('auth-token', token);

  res.send('Login feito com sucesso');
};

// Middleware function that verify if the token belongs to a registered user
exports.isLoggedIn = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send('Acesso Negado');
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).send('Token Inválido');
  }
};
