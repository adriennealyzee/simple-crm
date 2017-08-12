const axios = require('axios');
const FacebookStrategy = require('passport-facebook').Strategy;
const async = require('async');
const configAuth = require('./auth');
const User = require('../app/models/user');
const Friend = require('../app/models/friend');

module.exports = function(passport) {

  // Serialize users into and out of the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'name', 'email', 'link', 'locale', 'timezone', 'friends', 'picture'],
    // passReqToCallback: true,
  },
  (accessToken, refreshToken, profile, done) => { -
    // defer execution of action until next pass of event loop
    process.nextTick(() => {
      User.findOne({ facebook_id: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        } else if (user) {
          return done(null, err);
        } else {

          // TODO urgent: change this to an upsert
          const newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.url = profile.profileUrl;
          newUser.facebook.photo = profile.photos[0].value;
          newUser.local.name = profile.name.givenName + ' ' + profile.name.familyName;
          if (profile.photos){
            newUser.facebook.photo = profile.photos[0].value;
          }
          if (profile.emails) {
            newUser.email = profile.emails[0].value;
          }
          newUser.save((err) => {
            if (err) {
              return console.log('Err saving user: ', err);
            }
            done(null, newUser);
            var newUserId = newUser.id;

            // Get friends
            const friendsUrl = 'https://graph.facebook.com/v2.10/me/taggable_friends?access_token=' + accessToken;
            // let friendsList = [];
            axios.get(friendsUrl)
              .then(function(res) {
                var friends = res.data.data;

                //Convert to async
                async.each(friends, (friend, cb) => {
                  // create new friend
                  // TODO urgent: change this to an upsert
                  var newFriend = new Friend({
                    userId: newUserId,
                    name: friend.name,
                    facebook: {
                      id: friend.id,
                      photo: friend.picture.data.url
                    }
                  });
                  // save to
                  newFriend.save((err) => {
                    if (err) {
                      return console.log('Err saving user friend: ', friend, err);
                    }
                    cb();
                    return;
                  })
                });
              })
              .catch(function(err) {
                console.log('Err getting taggable_friends: ', err);
              });
          });
        }
      });
    });
  },
  ));
};
