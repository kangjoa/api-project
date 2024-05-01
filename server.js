if (!process.env.PORT) {
  require('dotenv').config();
}

// Module Imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./data/db');

// App and Middleware Configuration
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const characters = require('./controllers/characters');
characters(app);
const quotes = require('./controllers/quotes');
quotes(app);
const auth = require('./controllers/auth.js');
auth(app);

const { ensureAuthenticated } = require('./middleware');

// Start the Server
app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});

module.exports = app;
