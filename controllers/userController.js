const mongoose = require('mongoose');

const User = mongoose.model('User');

// TODO Validar registro de usuário

exports.registerUser = async (req, res, next) => {
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
