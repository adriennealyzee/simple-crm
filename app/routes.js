const express = require('express');
const db = require('../config/database');
const router = express.Router();
const Friend = require('./models/friend');
const User = require('./models/user');
const querystring = require('querystring');


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
    }).limit(100);
  }
});

router.get('/friendinfo', function(req, res) {
  Friend.find( { _id: req.query.id }, function(err, friend) {
    if (err) {
      console.log('Err finding friend: ', err);
      res.sendStatus(500);
    }
    res.send(friend[0]);
  })
});

router.get('/tags', function(req, res) {
  const friendId = req.query.friendId;
  Friend.findById(friendId, function(err, friend) {
    if (err) {
      console.log('err finding friend: ', err);
    }
    if (friend) {
      res.send(friend.tags);
    }
  });
});

router.get('/notes', function(req, res) {
  const friendId = req.query.friendId; // TODO: does it usually come from the query?
  Friend.findById(friendId, function(err, friend) {
    if (err) {
      console.log('err finding friend: ', err);
    }
    if (friend) {
      res.send(friend.notes);
    }
  });
});

router.get('/failed', function(req, res) {
  res.send('failed');
});

router.post('/addnote', function(req, res) {
  console.log('adding a note');
  // Find friend and save friend
  Friend.findById(req.body.friendId, function(err, friend) {
    if (err) {
      console.log('err finding friend: ', err);
    }
    if (friend){
      let newNote = { date: req.body.date, text: req.body.text };
      var arr = friend.notes;
      arr.push(newNote);
      friend.notes = arr;
      friend.save((err) => {
        if (err) {
          console.log('err saving new friend: ', err);
        }
        res.status(200);
        res.send();
      });
    }
  });
});

router.post('/addtag', function(req, res) {
  console.log('adding a tag');
  console.log('req.user.id', req.user.id)
  console.log('req.body.newTag', req.body.newTag)

  // add to user global store of tags
  User.findById(req.user.id, function(err, user) {
    if (err) {
      console.log('err finding user: ', err);
    }
    console.log('user found: ', user)
    if (user) {
      let newTag = req.body.newTag;
      if (!user.meta.tags) user.meta.tags = {};

      var tags = Object.assign({}, user.meta.tags);

      if (tags.hasOwnProperty(newTag)) {
        tags[newTag]++;
        user.meta.tags = Object.assign({}, tags);
      } else {
        user.meta.tags = Object.assign(tags, { [newTag]: 1 });
      }

      user.save((err) => {
        if (err) {
          console.log('err saving user tags: ', err);
        }
      }).then(item => {
        console.log('item saved to database', item);

        // add to friend
        Friend.findById(req.body.friendId, function(err, friend) {
          if (err) {
            console.log('err finding friend: ', err);
          }
          if (friend) {
            let newTag = req.body.newTag;
            var newTags = [...friend.tags, newTag];
            friend.tags = newTags;
            friend.save((err) => {
              if (err) {
                console.log('err saving friend: ', err);
              }
              res.status(200);
              res.send();
            })
          }
        }); // end adding to friend

      })
    }
  });


});

module.exports = router;

