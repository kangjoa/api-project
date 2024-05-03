/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (app) => {
  app.post('/sign-up', async (req, res) => {
    // Create User and JWT
    try {
      const user = new User(req.body);
      await user.save();

      const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res
        .status(201)
        .send({ message: 'User successfully created', token });
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Failed to create user', message: err.message });
    }
  });

  // LOGIN
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username }, { password });
      if (!user) {
        // User not found
        return res.status(401).send({ message: 'Wrong Username or Password' });
      }

      // Check the password
      await new Promise((resolve, reject) => {
        user.comparePassword(password, (err, match) => {
          if (err) reject(err);
          resolve(match);
        });
      });

      // Create a token
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET,
        {
          expiresIn: '60 days',
        },
      );

      // Set a cookie and return the token
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.status(200).send({ token });
    } catch (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });
};
