const express = require('express');
const db = require('../config/database');
const router = express.Router();
const Friend = require('./models/friend');

router.get('/currentuser', function(req, res) {
  console.log('getting current user');
  res.send(req.user);
});

router.get('/allmypeople', function(req, res) {
  console.log('getting all my people');

  // find friends where userId === req.user._id
  Friend.find({ userId: req.user.id }, function(err, friends) {
    if (err) {
      console.log('Err finding friends: ', err);
      res.sendStatus(500)
    }
    res.send(friends);
  });

});

module.exports = router;

