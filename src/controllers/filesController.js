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
 * /postFile/TCC:
 *   post:
 *     tags:
 *     - "FilePDF"
 *     summary: "Upload TCC File"
 *     description: ""
 *     operationId: "tccUpload"
 *     produces:
 *     - "application/json"
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: tccFile
 *         type: file
 *         description: TCC File to upload
 *         x-mimetype: application/pdf
 *         required: true
 *       - in: header
 *         name: AuthToken
 *         schema:
 *           type: string
 *           format: Json Web Token
 *         required: true
 *     responses:
 *       200:
 *         description: "File uploaded successfully"
 *       400:
 *         description: "Something went wrong with the file upload"
 */

const tccUpload = async (req, res) => {
  try {
    const saved = await saveFile(req.file, req.headers.authtoken);
    return res.status(200).send(saved);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

module.exports = { tccUpload };
