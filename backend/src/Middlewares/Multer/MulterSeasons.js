const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderMap = {
      poster: '../../assets/Series/Seasons',
    };

    const destination = folderMap[file.fieldname];
    if (destination) {
      cb(null, path.join(__dirname, destination));
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const uploadSeasons = multer({ storage });

module.exports = uploadSeasons;
