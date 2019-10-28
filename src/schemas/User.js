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
    required: true,
    max: 128,
    min: 6,
  },
  collegiate: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 128,
  },
  department: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 128,
  },
  password: {
    type: String,
    required: true,
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

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
