const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const formatError = require('../../utils/formatError');
const auth = require('../../middleware/auth');

const router = express.Router();

/**
 * @route         GET api/auth
 * @description   Test if authenticated
 * @access        Private
 */
router.get('/', auth, async (req, res) =>
  res.send(`Authenticated with user id: ${req.user.id}`)
);

/**
 * @route         POST api/auth
 * @description   Login to get token
 * @access        Public
 */
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (!user) return res.status(401).json(formatError('Invalid Credentials'));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json(formatError('Invalid Credentials'));

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: 36000000,
    });

    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         POST api/auth/register
 * @description   Register user
 * @access        Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json(formatError('User already exists'));
    }

    user = new User({ username, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: 36000000,
    });

    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

module.exports = router;
