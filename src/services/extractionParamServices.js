const mongoose = require('mongoose');
const { ValidationException } = require('../handlers/exceptionHandlers');

const ExtractionParams = mongoose.model('ExtractionParams');

const persistParam = async params => {
  const paramExist = await ExtractionParams.findOne({
    extractionTitle: params.extractionTitle,
    docType: params.docType,
  });
  if (paramExist) {
    throw new ValidationException(
      `There's a parameter for ${params.docType} with the name: ${params.extractionTitle}`
    );
  }

  const newParam = new ExtractionParams({ ...params });
  try {
    await newParam.save();
    return newParam;
  } catch (e) {
    throw e;
  }
};

module.exports = { persistParam };
