const jwt = require('jsonwebtoken');

const assignToken = payload => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

const verifyToken = token => {
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  return verified;
};

module.exports = { assignToken, verifyToken };
