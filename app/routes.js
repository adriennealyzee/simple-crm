const express = require('express');
const db = require('../config/database');
const router = express.Router();
const Friend = require('./models/friend');
const querystring = require('querystring')

router.get('/currentuser', function(req, res) {
  res.send(req.user);
});

router.get('/allmypeople', function(req, res) {
  // Find friends where userId === req.user._id
  if (req.user) {
    Friend.find({ userId: req.user.id }, function(err, friends) {
      if (err) {
        console.log('Err finding friends: ', err);
        res.sendStatus(500)
      }
      res.send(friends);
    });
  }
});

router.get('/friendinfo', function(req, res) {
  console.log('getting friend.. ');
  console.log('req.query.id', req.query.id);

  Friend.find( { _id: req.query.id }, function(err, friend) {
    if (err) {
      console.log('Err finding friend: ', err);
      res.sendStatus(500);
    }
    console.log('friend', friend);
    res.send(friend[0]);
  })

});

module.exports = router;

