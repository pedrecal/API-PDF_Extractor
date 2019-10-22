const express = require('express');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.post('/register', catchErrors(userController.registerUser));

router.post('/login', (req, res) => {
  res.send('Register');
});

module.exports = router;
