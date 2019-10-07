const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.post('/register', userController.registerUser);

router.post('/login', (req, res) => {
  res.send('Register');
});

module.exports = router;
