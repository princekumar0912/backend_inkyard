// require('dotenv').config();


// const account_sid = process.env.TWILIO_ACCOUNT_SID;
// const auth_token = process.env.TWILIO_AUTH_TOKEN;

// const client = require('twilio')(account_sid, auth_token);

// const sendSMS = async (body) => {
//   let msgoptions = {
//     from: process.env.TWILIO_FROM_NUMBER,
//     to: process.env.TWILIO_TO_NUMBER,
//     body
//   }
//   try {
//     const message = await client.messages.create(msgoptions);

//   } catch (error) {
//     console.log(error);
//   }
// }
// sendSMS('hello from twilio tsting')