// models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  additionalInfo: { type: String },
  type: { type: String, required: true },  // Added type field
});

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
