const mongoose = require('mongoose');
const Character = require('../models/character');
const { ensureAuthenticated } = require('../middleware');

module.exports = function (app) {
  // GET ALL
  app.get('/characters', ensureAuthenticated, (req, res) => {
    Character.find()
      .then((characters) => {
        if (characters.length === 0) {
          res.status(404).json({ error: 'No characters found' });
        } else {
          res.status(200).json({ characters });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // SHOW
  app.get('/characters/:id', ensureAuthenticated, (req, res) => {
    Character.findById(req.params.id)
      .then((character) => {
        if (!character) {
          res.status(404).json({ error: 'No characters found' });
        } else {
          res.status(200).json({ character });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // CREATE
  app.post('/characters', ensureAuthenticated, (req, res) => {
    const character = new Character(req.body);

    character
      .save()
      .then((character) => {
        res
          .status(201)
          .json({ message: 'Character successfully created', character });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // UPDATE
  app.put('/characters/:id', ensureAuthenticated, (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    Character.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((character) => {
        if (!character) {
          return res.status(404).json({ error: 'No characters found' });
        }
        res
          .status(200)
          .json({ message: 'Character successfully updated', character });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // DELETE
  app.delete('/characters/:id', ensureAuthenticated, (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    Character.findByIdAndDelete(req.params.id)
      .then((character) => {
        if (!character) {
          return res.status(404).json({ error: 'No characters found' });
        }
        res.status(200).json({ message: 'Character successfully deleted' });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
};
