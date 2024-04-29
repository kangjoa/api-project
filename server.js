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

const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
  // Check for the token in the request headers
  const token = req.headers['authorization'];

  if (!token) {
    // If no token is provided, send a 401 Unauthorized response
    return res.status(401).send({ message: 'Unauthorized: No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      // If the token is not valid, send a 401 Unauthorized response
      return res.status(401).send({ message: 'Unauthorized: Invalid token' });
    }

    // If everything is good, save the decoded token to the request for use in other routes
    req.user = decoded;
    next();
  });
}

// Use the middleware function in your routes
app.get('/protected-route', ensureAuthenticated, (req, res) => {
  // This route is now protected
});

// Start the Server
app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});

module.exports = app;
