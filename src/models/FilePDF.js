const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const FilePDFSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    max: 256,
    min: 6,
  },
  key: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    max: 256,
    min: 6,
  },
  type: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
});

FilePDFSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('FilePDF', FilePDFSchema);
