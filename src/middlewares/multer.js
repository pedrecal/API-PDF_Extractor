const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const fileDestination = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

const multerConfig = {
  dest: fileDestination,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fileDestination);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err);
        } else {
          const fileName = `${hash.toString('hex')}-${file.originalname}`;
          cb(null, fileName);
        }
      });
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only pdfs are allowed'));
    }
    cb(null, true);
  },
};

const multerPDF = multer(multerConfig);

module.exports = { multerPDF };
