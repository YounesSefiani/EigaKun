const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tokyotweener21@gmail.com',
    pass: 'elhb gync ldnd xrzt',
  },
});

module.exports = transporter;
