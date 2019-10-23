const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../handlers/validation');

const User = mongoose.model('User');

// TODO Validar registro de usuário

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
    name: req.body.name,
    password: hashPassword,
  });
  try {
    // Save new user to mongo
    const savedUser = await user.save();
    // TODO Remove
    console.log(savedUser);
    res.send('User saved successfully!');
  } catch (e) {
    res.status(400).send(e);
  }
  next(); // pass to authController.login
};
