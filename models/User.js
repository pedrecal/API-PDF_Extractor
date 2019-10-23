const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

// TODO decidir informacoes do Colegiado
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: 'Endereço de email obrigatório',
    max: 255,
    min: 6,
  },
  name: {
    type: String,
    required: 'Nome obrigatório',
    trim: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: 'Senha obrigatória',
    trim: true,
    max: 1024,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
