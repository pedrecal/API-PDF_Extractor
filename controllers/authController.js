const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginValidation } = require('../handlers/validation');

const User = mongoose.model('User');

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

  // Create and assign a jwt to the user
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token);

  res.send('Login feito com sucesso');
};
