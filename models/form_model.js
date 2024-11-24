const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  gender: { type: String, required: true },
  notes: { type: String, required: false },
});


module.exports = mongoose.model('form', formSchema); 