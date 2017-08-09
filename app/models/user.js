const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String,
  },
  facebook: {
    id: String,
    email: String,
    friends: String,
    url: String,
    name: String,
    photo: String,
    token: String,
  },
});

module.exports = mongoose.model('User', userSchema);
