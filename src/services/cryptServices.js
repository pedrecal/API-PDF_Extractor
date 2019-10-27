const bcrypt = require('bcryptjs');

// Check if password match
const isValidPassword = async (receivedPassword, userPassword) => {
  const validPassword = await bcrypt.compare(receivedPassword, userPassword);
  if (!validPassword) {
    return false;
  }
  return true;
};

// Hash the password
const hashPassword = async receivedPassword => {
  const salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(receivedPassword, salt);
  return passwordHashed;
};

module.exports = { isValidPassword, hashPassword };
