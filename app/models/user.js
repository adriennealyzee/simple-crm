const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String,
    email: String,
    name: String,
  },
  facebook: {
    id: String,
    friends: String,
    url: String,
    photo: String,
    token: String,
  },
});

module.exports = mongoose.model('User', userSchema);
