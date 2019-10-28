const { signInUser } = require('../services/userServices');
const { registerValidation } = require('../validators/userValidator');

/**
 * @swagger
 *
 * definitions:
 *   AuthToken:
 *     description: "Authenticated User"
 *     type: "string"
 *     format: "Json Web Token"
 *   User:
 *    type: "object"
 *    properties:
 *      id:
 *        type: "string"
 *        format: "ObjectId"
 *        readOnly: true
 *      email:
 *        type: "string"
 *        format: "email"
 *        minLength: 6
 *        maxLength: 128
 *      collegiate:
 *        type: "string"
 *        minLength: 6
 *        maxLength: 128
 *      department:
 *        type: "string"
 *        minLength: 6
 *        maxLength: 128
 *      password:
 *        type: "string"
 *        format: "password"
 *      creationDate:
 *        type: "string"
 *        format: "Date"
 *        readOnly: true
 *      resetPasswordToken:
 *        type: "string"
 *        readOnly: true
 *      resetPasswordExpires:
 *        type: "string"
 *        format: "Date"
 *        readOnly: true
 */

/**
 *  @swagger
 * /user/register:
 *   post:
 *     tags:
 *     - "user"
 *     summary: "Sign In new User"
 *     description: ""
 *     operationId: "registerUser"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "User Object"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/User"
 *     responses:
 *       200:
 *         description: "User signed successfully"
 *       400:
 *         description: "There was an error. Verify the user object."
 */

const registerUser = async (req, res) => {
  // Validate user passed
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = { ...req.body };

  try {
    await signInUser(user);
    return res.status(200).send('User saved successfully');
  } catch (e) {
    console.error(e);
    return res.status(400).send(e.message);
  }
};

module.exports = { registerUser };
