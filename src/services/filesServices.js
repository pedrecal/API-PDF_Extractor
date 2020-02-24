const mongoose = require('mongoose');
const { verifyToken } = require('../services/authTokenService');
const { getFileData } = require('./extractionService');

const FilePDF = mongoose.model('FilePDF');
const ExtractData = mongoose.model('ExtractData');
const User = mongoose.model('User');

const saveFile = async (file, userToken, docType) => {
  const { _id: userID } = verifyToken(userToken);
  let school = await User.find({ _id: userID }).select({
    _id: 0,
    collegiate: 1,
  });
  school = school[0].collegiate;

  const {
    originalname: name,
    size,
    filename: key,
    fieldname,
    path: filePath,
  } = file;

  // remove 'File' part of string to result just in the file type
  const type = fieldname.substring(0, fieldname.length - 4);
  const newFile = new FilePDF({
    userID,
    name,
    size,
    type,
    filePath,
    key,
  });
  // await extractData(filePath);
  try {
    // Register the new file on DB
    // await newFile.save();
    // Extract infos from de PDF file
    // console.log(docType);
    const extractedData = await getFileData(filePath, docType);
    // save de extracted data to db
    // const newAnalyzedPDF = await ExtractData.create({
    const newAnalyzedPDF = await ExtractData.create({
      userID,
      fileID: newFile._id,
      school,
      ...extractedData,
    });
    return newAnalyzedPDF;
  } catch (e) {
    throw e;
  }
};

module.exports = { saveFile };
