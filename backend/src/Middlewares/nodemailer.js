const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tokyotweener21@gmail.com',
    pass: 'eofi jlta jdfg tadi',
  },
});

module.exports = transporter;