const Character = require('../models/character');

module.exports = function (app) {
  app.get('/characters', (req, res) => {
    Character.find()
      .then((characters) => {
        if (characters.length === 0) {
          res.status(404).json({ error: 'No characters found' });
        } else {
          res.json({ characters });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // SHOW
  app.get('/characters/:id', (req, res) => {
    // find character
    Character.findById(req.params.id)
      .then((character) => {
        // fetch its comments
        Comment.find({ characterId: req.params.id }).then((comments) => {
          // respond with the template with both values
          res.render('characters-show', {
            character: character,
            comments: comments,
          });
        });
      })
      .catch((err) => {
        // catch errors
        console.log(err.message);
      });
  });

  // CREATE
  app.post('/characters', (req, res) => {
    Character.create(req.body)
      .then((character) => {
        console.log(character);
        res.redirect(`/characters/${character._id}`); // Redirect to characters/:id
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // EDIT
  app.get('/characters/:id/edit', (req, res) => {
    Character.findById(req.params.id)
      .then((character) => {
        res.render('characters-edit', {
          character: character,
          title: 'Edit character',
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // UPDATE
  app.put('/characters/:id', (req, res) => {
    Character.findByIdAndUpdate(req.params.id, req.body)
      .then((character) => {
        res.redirect(`/characters/${character._id}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // DELETE
  app.delete('/characters/:id', function (req, res) {
    console.log('DELETE character');
    Character.findByIdAndDelete(req.params.id)
      .then((character) => {
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};
