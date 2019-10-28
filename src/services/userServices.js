const mongoose = require('mongoose');
const crypto = require('crypto');
const { ValidationException } = require('../handlers/exceptionHandlers');

const { assignToken } = require('./authTokenService');
const { hashPassword, isValidPassword } = require('./cryptServices');
const { mailResetPasswordInstructions } = require('./mailServices');

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

// Reset password token is saved in the database
const generateResetPasswordToken = async email => {
  //! TODO: Maybe i shouldn't be checking this in 2 places
  // Check if user email exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(`There's no account with that email`);
  }
  // Set a reset token and expire date
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  // 1 hour from now
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
};

const recoverPassword = async email => {
  //! TODO: Maybe i shouldn't be checking this in 2 places
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(`There's no account with that email`);
  }

  try {
    // generate the token and save it in the db
    await generateResetPasswordToken(email);
    return await mailResetPasswordInstructions(email);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const setNewPassword = async (token, newPassword) => {
  const user = await User.findOne({
    // Verify if token is valid and exists
    resetPasswordToken: token,
    // $gt = Greather Than, this means that if is the date is valid...
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ValidationException(`Invalid token`);
  }

  try {
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return await user.save();
  } catch (e) {
    throw e;
  }
};

const removeUser = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(`There's no account with that email`);
  }

  try {
    return await user.remove();
  } catch (e) {
    throw e;
  }
};

module.exports = {
  signInUser,
  logInUser,
  recoverPassword,
  setNewPassword,
  removeUser,
};
