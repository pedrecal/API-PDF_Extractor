const mongoose = require('mongoose');

const TCC = mongoose.model('TCC');
const ExtractionParams = mongoose.model('ExtractionParams');

const { persistParam } = require('../services/extractionParamServices');

/**
 *  @swagger
 * /extraction/registeredParams:
 *   get:
 *     tags:
 *     - "Extraction"
 *     summary: "Return all extracted params"
 *     description: ""
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: "Array of JSON objects with the extracted params"
 *         schema:
 *            type: array
 *            items:
 *              type: object
 */

const listAllParams = async (req, res) => {
  const params = await ExtractionParams.find({});
  return res.json(params);
};
/**
 *  @swagger
 * /extraction/allExtracted:
 *   get:
 *     tags:
 *     - "Extraction"
 *     summary: "Return all extracted information"
 *     description: ""
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: "Array of JSON objects with the extracted data"
 *         schema:
 *            type: array
 *            items:
 *              type: object
 */

const listAllExtracted = async (req, res) => {
  const TCCs = await TCC.find({});
  return res.json(TCCs);
};

/**
 *  @swagger
 * /extraction/removeExtracted/{dataID}:
 *   delete:
 *     tags:
 *     - "Extraction"
 *     summary: "Remove extraction data from specific"
 *     description: ""
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: "Succesfully removed"
 */

const removeExtracted = async (req, res) => {
  try {
    const deletedTCC = await TCC.deleteOne({ _id: req.params.dataID });
    return res.json(deletedTCC);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e.message);
  }
};

/**
 *  @swagger
 * /extraction/setExtractionParams:
 *   post:
 *     tags:
 *     - "Extraction"
 *     summary: "Save filters to extract PDF information"
 *     description: ""
 *     operationId: "setExtractionParams"
 *     produces:
 *     - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: extractionParams
 *         schema:
 *            type: object
 *            properties:
 *                extractionTitle:
 *                  type: string
 *                page:
 *                  type: array
 *                  items:
 *                    type: number
 *                coordinatesStart:
 *                  type: object
 *                  properties:
 *                    x:
 *                      type: number
 *                    y:
 *                      type: number
 *                coordinatesEnd:
 *                  type: object
 *                  properties:
 *                    x:
 *                      type: number
 *                    y:
 *                      type: number
 *                regex:
 *                  type: string
 *                docType:
 *                  type: string
 *                keyWords:
 *                  type: array
 *                  items:
 *                    type: string
 *            required:
 *              -extractionTitle
 *              -page
 *              -coordinates
 *              -docType
 *       - in: header
 *         name: AuthToken
 *         schema:
 *           type: string
 *           format: Json Web Token
 *         required: true
 *     responses:
 *       200:
 *         description: "TODO"
 *       400:
 *         description: "TODO"
 */

const setExtractionParams = async (req, res) => {
  try {
    const savedParam = await persistParam(req.body);
    return res.json(savedParam);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e.message);
  }
};

/**
 *  @swagger
 * /extraction/registeredParam/{paramID}:
 *   delete:
 *     tags:
 *     - "Extraction"
 *     summary: "Remove parameter"
 *     description: ""
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: "Succesfully removed"
 */

const removeExtractionParam = async (req, res) => {
  try {
    const deletedParam = await ExtractionParams.deleteOne({ _id: req.params.dataID });
    return res.json(deletedParam);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e.message);
  }
};

module.exports = {
  listAllExtracted,
  setExtractionParams,
  removeExtracted,
  listAllParams,
  removeExtractionParam
};
