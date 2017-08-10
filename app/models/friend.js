const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: String,
  name: String,
  facebook: {
    id: String,
    photo: String,
  },
  notes: String,
});

module.exports = mongoose.model('Friend', friendSchema);