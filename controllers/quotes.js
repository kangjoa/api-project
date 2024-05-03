const mongoose = require('mongoose');
const Quote = require('../models/quote');
const { ensureAuthenticated } = require('../middleware');

module.exports = function (app) {
  // GET ALL
  app.get('/quotes', ensureAuthenticated, (req, res) => {
    Quote.find()
      .then((quotes) => {
        if (quotes.length === 0) {
          res.status(404).json({ error: 'No quotes found' });
        } else {
          res.status(200).json({ quotes });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // SHOW
  app.get('/quotes/:id', ensureAuthenticated, (req, res) => {
    Quote.findById(req.params.id)
      .then((quote) => {
        if (!quote) {
          res.status(404).json({ error: 'No quotes found' });
        } else {
          res.status(200).json({ quote });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // CREATE
  app.post('/quotes', ensureAuthenticated, (req, res) => {
    const quote = new Quote(req.body);

    quote
      .save()
      .then((quote) => {
        res.status(201).json({ message: 'Quote successfully created', quote });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // UPDATE
  app.put('/quotes/:id', ensureAuthenticated, (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    Quote.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((quote) => {
        if (!quote) {
          return res.status(404).json({ error: 'No quotes found' });
        }
        res.status(200).json({ message: 'Quote successfully updated', quote });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // DELETE
  app.delete('/quotes/:id', ensureAuthenticated, (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    Quote.findByIdAndDelete(req.params.id)
      .then((quote) => {
        if (!quote) {
          return res.status(404).json({ error: 'No quotes found' });
        }
        res.status(200).json({ message: 'Quote successfully deleted' });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
};
