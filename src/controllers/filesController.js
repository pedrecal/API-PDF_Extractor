const { saveFile } = require('../services/filesServices');

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

/**
 *  @swagger
 * /postFile:
 *   post:
 *     tags:
 *     - "FilePDF"
 *     summary: "Upload File"
 *     description: ""
 *     operationId: "fileUpload"
 *     produces:
 *     - "application/json"
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: pdfFile
 *         type: file
 *         description: File to upload
 *         x-mimetype: application/pdf
 *         required: true
 *       - in: header
 *         name: AuthToken
 *         schema:
 *           type: string
 *           format: Json Web Token
 *         required: true
 *       - in: formData
 *         name: docType
 *         schema:
 *           type: string
 *           format: string
 *         required: true
 *     responses:
 *       200:
 *         description: "Extracted Information"
 *         schema:
 *            type: object
 *       400:
 *         description: "Something went wrong with the file upload"
 */

const pdfUpload = async (req, res) => {
  try {
    const saved = await saveFile(
      req.file,
      req.headers.authtoken,
      req.body.docType
    );
    return res.status(200).send(saved);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

module.exports = { pdfUpload };
