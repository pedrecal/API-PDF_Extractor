const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');

const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { multerPDF } = require('../middlewares/multer');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const filesController = require('../controllers/filesController');

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

// TCC File Related
router.post(
  '/postFile/TCC',
  isLoggedIn,
  multerPDF.single('tccFile'),
  catchErrors(filesController.tccUpload)
);

module.exports = router;
