const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Quote = mongoose.model('Quote', {
  content: String,
  season: Number,
  episode: Number,
  characterId: { type: Schema.Types.ObjectId, ref: 'Character' },
});

module.exports = Quote;
