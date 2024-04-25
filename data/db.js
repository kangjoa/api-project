// TODO: Set up your Mongoose connection here.
/* Mongoose Connection */
const mongoose = require('mongoose');
assert = require('assert');

const url = 'mongodb://localhost/db';

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected successfully to database');
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
