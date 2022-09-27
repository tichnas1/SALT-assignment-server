const jwt = require('jsonwebtoken');

const User = require('../models/User');
const formatError = require('../utils/formatError');

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description middleware to check token and protect private routes
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json(formatError('Token not found'));

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user;
    } catch (err) {
      return res.status(401).json(formatError('Invalid token'));
    }

    const user = await User.findById(req.user.id).select('_id');

    if (!user) return res.status(401).json(formatError('Invalid token'));

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(formatError('Server Error'));
  }
};

module.exports = auth;
