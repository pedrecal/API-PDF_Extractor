const mongoose = require('mongoose');

const TCC = mongoose.model('TCC');

/**
 * @swagger
 *
 * definitions:
 *   FilePDF:
 *    type: "object"
 *    properties:
 *      id:
 *        type: "string"
 *        format: "ObjectId"
 *        readOnly: true
 *      userID:
 *        type: "string"
 *        format: "ObjectID"
 *        description: "Uploader user ID"
 *        readOnly: true
 *      name:
 *        type: "string"
 *        minLength: 6
 *        maxLength: 256
 *        description: "File name as it was uploaded"
 *        readOnly: true
 *      key:
 *        type: "string"
 *        minLength: 6
 *        maxLength: 256
 *        description: "Unique hash + file name"
 *        unique: true
 *        readOnly: true
 *      filePath:
 *        type: "string"
 *        readOnly: true
 *      size:
 *        type: "number"
 *        description: "File size in bytes"
 *        readOnly: true
 *      creationDate:
 *        type: "string"
 *        format: "Date"
 *        readOnly: true
 */

const listAllExtracted = async (req, res) => {
  const TCCs = await TCC.find({});
  return res.json({ ...TCCs });
};

module.exports = { listAllExtracted };
