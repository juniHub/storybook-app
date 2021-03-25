const multer = require( 'multer' );

/** Storage Engine */
const storageEngine = multer.diskStorage({
  
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().getTime().toString() +
       file.originalname
    );
  },
} );

// accept image files only
const imageFilter = function (req, file, cb) {
  
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

//init

const upload = multer( {
  storage: storageEngine,
  fileFilter: imageFilter
} ).single("image");

module.exports = upload;
