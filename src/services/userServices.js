const mongoose = require('mongoose');
const { ValidationException } = require('../handlers/exceptionHandlers');

const { assignToken } = require('./authTokenService');
const { hashPassword, isValidPassword } = require('./cryptServices');

const User = mongoose.model('User');

const signInUser = async user => {
  // Check if user already exists
  const emailExist = await User.findOne({ email: user.email });
  if (emailExist) {
    throw new ValidationException(`${user.email} already registered`);
  }

  // Hash the password
  const hashedPassword = await hashPassword(user.password);

  // Create a new user
  const newUser = new User({
    email: user.email,
    collegiate: user.collegiate,
    department: user.department,
    password: hashedPassword,
  });

  try {
    // Save new user to mongo
    await newUser.save();
    return true;
  } catch (e) {
    throw e;
  }
};

const logInUser = async (email, password) => {
  // Check if user email exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(`Wrong user and/or password`);
  }

  // Check if password match
  const validatedPassword = await isValidPassword(password, user.password);
  if (!validatedPassword) {
    throw new ValidationException(`Wrong user and/or password`);
  }

  const token = assignToken({ _id: user._id });
  return token;
};

module.exports = { signInUser, logInUser };
