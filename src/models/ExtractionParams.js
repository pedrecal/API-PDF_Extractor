const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const ExtractionParamsSchema = new Schema(
  {
    extractionTitle: {
      type: String,
      required: true,
    },
    pages: [
      {
        type: Number,
        required: true,
      },
    ],
    // TODO add required
    coordinatesStart: {
      x: Number,
      y: Number,
    },
    coordinatesEnd: {
      x: Number,
      y: Number,
    },
    regex: {
      type: String,
    },
    docType: {
      type: String,
      required: true,
    },
    keyWords: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ExtractionParamsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ExtractionParams', ExtractionParamsSchema);
