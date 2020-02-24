const {
  loginValidation,
  emailValidation,
  passwordValidation,
  emailAsParamValidation,
} = require('../validators/userValidator');

const {
  logInUser,
  recoverPassword,
  setNewPassword,
  removeUser,
} = require('../services/userServices');

/**
 *  @swagger
 * /user/login:
 *   post:
 *     tags:
 *     - "User"
 *     summary: "Log User"
 *     description: ""
 *     operationId: "loginUser"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "User email and password"
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

const loginUser = async (req, res) => {
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

/**
 *  @swagger
 * /user/forgotPassword:
 *   post:
 *     tags:
 *     - "User"
 *     summary: "Rest user password"
 *     description: ""
 *     operationId: "forgotPassword"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "User email"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           email:
 *              type: "string"
 *              format: "email"
 *              minLength: 6
 *              maxLength: 128
 *     responses:
 *       200:
 *         description: "Password recover email sent"
 *         schema:
 *            type: "string"
 *       400:
 *         description: "Something wrong"
 */

const forgotPassword = async (req, res) => {
  // Validate email passed
  const { error } = emailValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await recoverPassword(req.body.email);
    return res.status(200).send('Password recover email sent');
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

/**
 *  @swagger
 * /user/resetPassword/{resetPasswordToken}:
 *   put:
 *     tags:
 *     - "User"
 *     summary: "Rest user password"
 *     description: ""
 *     operationId: "resetPassword"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "path"
 *       name: resetPasswordToken
 *       schema:
 *         type: "string"
 *       required: true
 *     - in: "body"
 *       name: "body"
 *       description: "Set new password user"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           password:
 *              type: "string"
 *              format: "password"
 *              minLength: 6
 *     responses:
 *       200:
 *         description: "New password set"
 *         schema:
 *            type: "string"
 *       400:
 *         description: "Invalid Token"
 */

const resetPassword = async (req, res) => {
  // Validate password passed
  const { error } = passwordValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await setNewPassword(req.params.resetPasswordToken, req.body.password);
    return res.status(200).send('New password set');
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

/**
 *  @swagger
 * /user/deleteUser/{userEmail}:
 *   delete:
 *     security:
 *       - apiKey: []
 *     tags:
 *     - "User"
 *     summary: "Delete user"
 *     description: ""
 *     operationId: "deleteUser"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "path"
 *       name: userEmail
 *       schema:
 *         type: "string"
 *       required: true
 *     responses:
 *       200:
 *         description: "User deleted"
 *         schema:
 *            type: "string"
 *       400:
 *         description: "Something wrong"
 */

const deleteUser = async (req, res) => {
  // Validate email passed as param
  const { error } = emailAsParamValidation(req.params.userEmail);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await removeUser(req.params.userEmail);
    return res.status(200).send('User deleted');
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

module.exports = { loginUser, forgotPassword, resetPassword, deleteUser };
