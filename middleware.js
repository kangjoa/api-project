const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
  const token = req.cookies.nToken;

  // decode token
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: 'No token provided' });
  }
}

module.exports = {
  ensureAuthenticated
};