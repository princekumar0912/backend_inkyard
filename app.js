const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
// const transporter = require('./nodemail');

///////////
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors());

//Mongodb connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

//Define schema and model

const Form = require('./models/form_model');
const Contact = require('./models/Contact_model');

///twilio
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

// email setup

// console.log('USER_EMAIL:', process.env.USER_EMAIL);

app.get('/home', (req, res) => {
  res.send('Welcome to the Tattoo Studio backend');
});


// Define the /contact route
app.post('/contact', async (req, res) => {

  // console.log(req.body);
  try {
    const { name, email, phone, message } = req.body;

    // Save to MongoDB Atlas
    const newContactForm = new Contact(req.body);
    await newContactForm.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL, // Your email address
        pass: process.env.EMAIL_PASSKEY, // Your email password or app-specific password
      },
    });

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Send to the user who filled the form
      subject: 'Thanks for contacting us!',
      text: `Hello ${name},\n\nThank you for reaching out. We have received your message: "${message}".\n your contact :"${phone}"\n\nWe will get back to you soon!\n\nBest regards,\nTeam Inkyard `,
    };
    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Contact form submitted and email sent successfully!' });
  } catch (err) {
    console.error('Error saving data or sending email:', err);
    res.status(500).send('Server error');
  }
});


app.post('/submit', async (req, res) => {
  console.log(req.body);
  const { name, email, phone, date, gender, notes } = req.body;

  if (!name || !email || !phone || !date || !gender) {
    return res.status(400).json({ error: 'All required fields must be filled!' });
  }
  try {
    const { name, email, phone, date, gender, notes } = req.body;

    const newForm = new Form(req.body);
    await newForm.save();

    const adminMessage =
      `
      New Appointment:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Appointment_Date: ${date}
      Gender: ${gender}
      Notes: ${notes}
    `;

    // Send SMS to the admin
    await client.messages.create({
      body: adminMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.RECIPIENT_PHONE_NUMBER, // Admin's phone number
    });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL, // Replace with actual email
        pass: process.env.EMAIL_PASSKEY,    // Replace with actual password
      },
    });


    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: req.body.email, // Send confirmation to the user's email
      subject: 'Appointment Confirmation',
      text: `Hello ${req.body.name},\n\nYour appointment has been booked on ${req.body.date}.\n\nour team will contact you to confirm your booking\n\n\nThanks for Booking!\nBest regards,\nTeam Inkyard`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      } else {
        return res.status(200).send('Form submitted and email sent successfully!');
      }
    });


  } catch (err) {
    res.status(500).send('Server error');
    // console.log(user);
    console.error('Error saving data:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
