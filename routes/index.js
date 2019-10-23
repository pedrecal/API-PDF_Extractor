const express = require('express');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Olá!');
});

router.post('/register', catchErrors(userController.registerUser));

module.exports = router;
