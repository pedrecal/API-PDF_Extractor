const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const routes = require('./routes/index');

const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister

// Get info from json package to use it in Swagger UI
const packageInfo = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')
);

// Swagger Options
const options = {
  swaggerDefinition: {
    info: {
      title: packageInfo.name,
      version: packageInfo.version,
      description: packageInfo.description,
    },
    basePath: `/api/`,
  },
  apis: ['./controllers/*.js'],
};

const specs = swaggerJSDoc(options);
app.use(`/api/docs`, swaggerUi.serve, swaggerUi.setup(specs));
// After all that above middleware, we finally handle our own routes!
app.use('/api', routes);

// done! we export it so we can start the site in start.js
module.exports = app;
