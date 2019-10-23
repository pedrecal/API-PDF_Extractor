const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');
const Joi = require('@hapi/joi');

const registerValidation = data => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .min(6)
      .email()
      .required(),
    name: Joi.string()
      .min(6)
      .trim()
      .required()
      .error(errors => {
        errors.forEach(err => {
          console.log(err.code);
          switch (err.code) {
            case 'any.empty':
              err.message = 'Value should not be empty!';
              break;
            case 'string.min':
              err.message = `Erro em ${err.local.label}! O valor deve ter no mínimo ${err.local.limit} caracteres!`;
              break;
            case 'string.max':
              err.message = `Value should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string()
      .min(6)
      .trim()
      .required(),
  });
  return schema.validate(data);
};
// TODO Validar registro de usuário

exports.registerUser = async (req, res, next) => {
  // Validate user passed
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res
      .status(400)
      .send(`Já existe um usuário cadastrado com este email`);
  }

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: hashPassword,
  });
  try {
    // Save new user to mongo
    const savedUser = await user.save();
    // TODO Remove
    console.log(savedUser);
    res.send('User saved successfully!');
  } catch (e) {
    res.status(400).send(e);
  }
  // next(); // pass to authController.login
};
