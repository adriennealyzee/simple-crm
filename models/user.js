const mongoose = require('mongoose');

const userSchema = mongoose.schema({
  local: {
    username: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
});

module.exports = mongoose.model('User', userSchema);