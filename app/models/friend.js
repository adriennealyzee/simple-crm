const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: String,
  name: String,
  info: String,
  facebook: {
    id: String,
    photo: String,
  },
  notes: [mongoose.Schema.Types.Mixed],
  tags: [String],
});

module.exports = mongoose.model('Friend', friendSchema);