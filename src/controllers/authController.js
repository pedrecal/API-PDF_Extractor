const { loginValidation } = require('../validators/userValidator');
const { logInUser } = require('../services/userServices');

/**
 *  @swagger
 * /user/login:
 *   post:
 *     tags:
 *     - "user"
 *     summary: "Log User"
 *     description: ""
 *     operationId: "loginUser"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Email and Password to log the user"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           email:
 *              type: "string"
 *              format: "email"
 *              minLength: 6
 *              maxLength: 128
 *           password:
 *              type: "string"
 *              format: "password"
 *     responses:
 *       200:
 *         description: "Logged In Successfully"
 *         schema:
 *            type: "string"
 *         headers:
 *            AuthToken:
 *                $ref: "#/definitions/AuthToken"
 *       400:
 *         description: "Email and/or password are wrong"
 */

exports.loginUser = async (req, res) => {
  // Validate user passed
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const token = await logInUser(req.body.email, req.body.password);
    return res.header('authToken', token).send('Logged in successfully');
  } catch (e) {
    console.error(e.message);
    return res.status(400).send(e.message);
  }
};
