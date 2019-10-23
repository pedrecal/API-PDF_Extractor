const mongoose = require('mongoose');
const { registerValidation } = require('../handlers/validation');

const User = mongoose.model('User');

// TODO Validar registro de usuário

exports.registerUser = async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    // TODO Remove
    console.log(savedUser);
    res.send('User saved successfully!');
  } catch (e) {
    res.status(400).send(e);
  }
  next(); // pass to authController.login
};
