/*******************************************************
 * middleware/auth.js
 *******************************************************/
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'defaultSecretKey';

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
