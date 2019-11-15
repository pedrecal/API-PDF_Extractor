const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const TCCSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    fileID: {
      type: Schema.Types.ObjectId,
      ref: 'FilePDF',
    },
    verified: Boolean,
    school: {
      type: String,
      // required: true,
    },
    author: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    advisor: {
      type: String,
      required: true,
    },
    coAdvisor: {
      type: String,
    },
    abstract: {
      type: String,
      required: true,
    },
    keyWords: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

TCCSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('TCC', TCCSchema);
