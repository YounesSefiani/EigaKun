const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderMap = {
            poster: '../../assets/Movies/Posters',
            logo: '../../assets/Movies/Logos',
            background: '../../assets/Movies/Backgrounds',
        }

        const destination = folderMap[file.fieldname];
        if (destination) {
            cb(null, path.join(__dirname, destination));
        } else {
            cb(new Error('Invalid file fieldname'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, "movies" + Date.now() + path.extname(file.originalname));
    },
});

const uploadMovies = multer({ storage });

module.exports = uploadMovies;