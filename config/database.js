const mongoose = require('mongoose');
const configAuth = require('./auth');

let mongoUri = 'mongodb://' + configAuth.db.user + ':' + configAuth.db.password+ '@ds153179.mlab.com:53179/heroku_0bjt87wj';
mongoose.connect(mongoUri);
const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  quantity: Number,
  description: String
});

var Item = mongoose.model('Item', itemSchema);

var selectAll = function(callback) {
  Item.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports.selectAll = selectAll;