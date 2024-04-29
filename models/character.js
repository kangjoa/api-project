const mongoose = require('mongoose');

const Character = mongoose.model('Character', {
  name: String,
  age: Number,
});

const Quote = require('../models/quote');

module.exports = Character;
