const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const ExtractedDataSchema = new Schema(
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
  },
  {
    timestamps: true,
    strict: false,
  }
);

ExtractedDataSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ExtractedData', ExtractedDataSchema);
