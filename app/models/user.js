const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

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
  google: {
    id: String,
    token: String,
    email: String,
  },
  meta: {
    tags: Object,
  },
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
