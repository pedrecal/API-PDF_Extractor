const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => res.send('Olá!'));

router.post('/user/register', userController.registerUser);
router.post('/user/login', catchErrors(authController.loginUser));

module.exports = router;
