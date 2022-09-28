const express = require('express');

const User = require('../../models/User');
const formatError = require('../../utils/formatError');
const auth = require('../../middleware/auth');

const router = express.Router();

/**
 * @route         GET api/balance
 * @description   Get balance of logged in user
 * @access        Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balance');

    if (!user) {
      return res.status(400).json(formatError('No user found'));
    }

    return res.json({ balance: user.balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         PUT api/balance/credit
 * @description   Increase balance of logged in user by given amount
 * @access        Private
 */
router.put('/credit', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { balance: amount },
      },
      { new: true }
    ).select('balance');

    if (!user) {
      return res.status(400).json(formatError('No user found'));
    }

    return res.json({ balance: user.balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         PUT api/balance/debit
 * @description   Decrease balance of logged in user by given amount
 * @access        Private
 */
router.put('/debit', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { balance: -amount },
      },
      { new: true }
    ).select('balance');

    if (!user) {
      return res.status(400).json(formatError('No user found'));
    }

    return res.json({ balance: user.balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

module.exports = router;
