const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  balance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('user', UserSchema);
