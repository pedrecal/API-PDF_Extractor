const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Olá!');
});

router.post(
  '/user/register',
  userController.registerUser
  // authController.loginUser
);
router.post('/user/login', catchErrors(authController.loginUser));

module.exports = router;
