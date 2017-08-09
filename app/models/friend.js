const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: String,
  facebook: {
    id: String,
    photo: String,
    name: String,
  },
  notes: String,
});

module.exports = mongoose.model('Friend', friendSchema);