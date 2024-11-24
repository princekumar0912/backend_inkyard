const nodemailer = require('nodemailer');
require('dotenv').config();


// Create a transporter using SMTP details
const sender = nodemailer.createTransport({
  service: 'gmail',  // Use 'gmail' for Gmail or other services like 'outlook' for Outlook
  auth: {
    user: process.env.USER_EMAIL, // Your email address
    pass: process.env.EMAIL_PASSKEY,  // Your email password (use App Passwords for Gmail)
  },
});
module.exports = sender;
