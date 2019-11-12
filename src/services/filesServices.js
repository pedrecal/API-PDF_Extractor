const mongoose = require('mongoose');
const { verifyToken } = require('../services/authTokenService');
const { getTCCData } = require('./extractionService');

const FilePDF = mongoose.model('FilePDF');
const TCC = mongoose.model('TCC');
const User = mongoose.model('User');

const saveFile = async (file, userToken) => {
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

  try {
    // Register the new file on DB
    await newFile.save();
    // Extract infos from de PDF file
    const {
      author,
      title,
      advisor,
      coadvisor,
      abstract,
      keyWords,
    } = await getTCCData(filePath);
    // save de extracted data to db
    const newAnalyzedTCC = await TCC.create({
      userID,
      fileID: newFile._id,
      school,
      author,
      title,
      advisor,
      coadvisor,
      keyWords,
      abstract,
    });
    return newAnalyzedTCC;
  } catch (e) {
    throw e;
  }
};

module.exports = { saveFile };
