const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
});

module.exports = mongoose.model('Accommodation', accommodationSchema);

