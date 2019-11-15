const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const User = mongoose.model('User');
const { ValidationException } = require('../handlers/exceptionHandlers');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailResetPasswordInstructions = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(`There's no account with that email`);
  }

  try {
    return await transport.sendMail({
      from: `"PDF Gen" <exemple@exemple.com>`,
      to: user.email,
      subject: `PDF Generator Reset Password`,
      text: `http://${process.env.HOST}/user/resetPassword/${user.resetPasswordToken}`,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = { mailResetPasswordInstructions };
