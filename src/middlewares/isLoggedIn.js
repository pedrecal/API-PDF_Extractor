const { verifyToken } = require('../services/authTokenService');

// Middleware function that verify if the token belongs to a registered user
exports.isLoggedIn = (req, res, next) => {
  const token = req.header('authToken');
  if (!token) {
    // If there is no token
    return res.status(401).send('Unauthorized access');
  }
  try {
    const verified = verifyToken(token);
    req.user = verified;
    next();
  } catch (e) {
    // If someone is tampering the token
    return res.status(400).send('Invalid Token');
  }
};
