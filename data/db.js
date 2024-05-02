// TODO: Set up your Mongoose connection here.
/* Mongoose Connection */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Character = require('../models/character');
const Quote = require('../models/quote');
const User = require('../models/user');

const url = 'mongodb://localhost/db';

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected successfully to database');

    // Drop all collections
    for (var i in mongoose.connection.collections) {
      await mongoose.connection.collections[i].deleteMany({});
    }

    const user = new User({
      username: 'testUser',
      password: 'testPassword',
    });

    await user.save();

    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'),
    );

    data.characters.forEach(async (characterData) => {
      const character = new Character({
        name: characterData.name,
        age: characterData.age,
      });

      const savedCharacter = await character.save();

      characterData.quotes.forEach(async (quoteData) => {
        const quote = new Quote({
          content: quoteData.content,
          season: quoteData.season,
          episode: quoteData.episode,
          characterId: savedCharacter._id,
        });

        await quote.save();
      });
    });
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection Error:'),
);
mongoose.set('debug', true);

module.exports = mongoose.connection;
