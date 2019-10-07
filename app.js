const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();
// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister

// After allllll that above middleware, we finally handle our own routes!
app.use('/api', routes);

// done! we export it so we can start the site in start.js
module.exports = app;
