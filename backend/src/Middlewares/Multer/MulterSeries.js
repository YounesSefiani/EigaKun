const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderMap = {
            poster: '../../assets/Series/Posters',
            logo: '../../assets/Series/Logos',
            background: '../../assets/Series/Backgrounds',
        }

        const destination = folderMap[file.fieldname];
        if (destination) {
            cb(null, path.join(__dirname, destination));
        } else {
            cb(new Error('Invalid file fieldname'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, "series" + Date.now() + path.extname(file.originalname));
    },
});

const uploadSeries = multer({ storage });

module.exports = uploadSeries;