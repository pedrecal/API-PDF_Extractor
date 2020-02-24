const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');

const assignToken = payload => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '24h',
  });
  return token;
};

const verifyToken = token => {
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  verified._id = Types.ObjectId(verified._id);
  return verified;
};

module.exports = { assignToken, verifyToken };
