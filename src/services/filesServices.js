const mongoose = require('mongoose');
const { verifyToken } = require('../services/authTokenService');

const FilePDF = mongoose.model('FilePDF');

const saveFile = async (file, userToken) => {
  const { _id: userID } = verifyToken(userToken);
  const {
    originalname: name,
    size,
    filename: key,
    fieldname,
    path: filePath,
  } = file;
  // remove File part of string to result just in the file type
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
    await newFile.save();
    return newFile;
  } catch (e) {
    throw e;
  }
};

module.exports = { saveFile };
