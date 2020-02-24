const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');

const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { multerPDF } = require('../middlewares/multer');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const filesController = require('../controllers/filesController');

const extractionController = require('../controllers/extractionController');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => res.send('Olá!'));

// Registration and deletion of user will be secured by apiKey

router.post('/user/register', userController.registerUser);
router.post('/user/login', catchErrors(authController.loginUser));
// router.get('/user/logout', catchErrors(authController.logoutUser));
router.post('/user/forgotPassword', catchErrors(authController.forgotPassword));
router.put(
  '/user/resetPassword/:resetPasswordToken',
  catchErrors(authController.resetPassword)
);
router.delete(
  '/user/deleteUser/:userEmail',
  catchErrors(authController.deleteUser)
);

// PDF File Related
router.post(
  '/postFile',
  isLoggedIn,
  multerPDF.single('pdfFile'),
  catchErrors(filesController.pdfUpload)
);

router.post(
  '/extraction/setExtractionParams',
  isLoggedIn,
  catchErrors(extractionController.setExtractionParams)
);

router.get(
  '/extraction/allExtracted',
  catchErrors(extractionController.listAllExtracted)
);

router.delete(
  '/extraction/removeExtracted/:dataID',
  catchErrors(extractionController.removeExtracted)
);

router.get(
  '/extraction/registeredParams',
  catchErrors(extractionController.listAllParams)
);

router.delete(
  '/extraction/registeredParams/:dataID',
  catchErrors(extractionController.removeExtractionParam)
);

module.exports = router;
