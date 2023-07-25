const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 100
  },
  phone: {
    type: String,
    required: true,
    min:10
  },
  email: {
    unique: true,
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  address: {
    type: String,
    required: true,
    min: 10,
    max: 255
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Course', ContactSchema);

module.exports = Contact;
