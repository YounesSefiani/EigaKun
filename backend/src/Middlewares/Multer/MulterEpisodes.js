const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderMap = {
            image: '../../assets/Series/Episodes/Images',
        }

        const destination = folderMap[file.fieldname];
        if (destination) {
            cb(null, path.join(__dirname, destination));
        } else {
            cb(new Error('Invalid file fieldname'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, "series_episode" + Date.now() + path.extname(file.originalname));
    },
});

const uploadEpisodes = multer({ storage });

module.exports = uploadEpisodes;