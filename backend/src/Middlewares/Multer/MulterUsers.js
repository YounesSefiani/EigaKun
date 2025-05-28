const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderMap = {
            avatar: '../../assets/Users/Avatars',
        }

        const destination = folderMap[file.fieldname];
        if (destination) {
            cb(null, path.join(__dirname, destination));
        } else {
            cb(new Error('Invalid file fieldname'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, "user" + Date.now() + path.extname(file.originalname));
    },
});

const uploadUsers = multer({ storage });

module.exports = uploadUsers;