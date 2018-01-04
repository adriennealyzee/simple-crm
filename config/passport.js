const axios = require('axios');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

  passport.use(new GoogleStrategy({
    clientID: '142167475620-u5r84u5p34qnl4p38t6f6i530hbn3fjg.apps.googleusercontent.com',
    clientSecret: 'vxEyFjE9qhbM_JYVoZ6xYex2',
    callbackURL: '/auth/google/callback'
  },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        console.log('getting google accessToken');
        console.log("accessToken ", accessToken);
        console.log("refreshToken  ", refreshToken);
        console.log("profile ", profile);
        // User.findOrCreate({ "google.id": profile.id }, (err, user, created) => {
        //   console.log('created', created);
        //   if (err) { console.log('err finding user', err) }
        //   console.log('user', user);
        //   return done(err, user);
        // });
      });
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'name', 'email', 'link', 'locale', 'timezone', 'friends', 'picture'],
  },
  (accessToken, refreshToken, profile, done) => { -
    // defer execution of action until next pass of event loop
    process.nextTick(() => {
      User.findOne({ "facebook.id": profile.id }, (err, user) => {
        if (err) {
          return done(err);
        } else {
          let newUser;
          if (user) {
            newUser = user;
            // update user
          } else {
            newUser = new User();
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
          }

          newUser.save((err) => {
            if (err) {
              return console.log('Err saving user: ', err);
            }
            done(null, newUser);
            var newUserId = newUser.id;

            function getFriends() {
              var friendsUrl = 'https://graph.facebook.com/v2.10/me/taggable_friends?access_token=' + accessToken;

              function recur() {
                axios.get(friendsUrl)
                  .then(function(res) {
                    var friends = res.data.data;

                    // Save friends into database
                    async.each(friends, (friend, cb) => {
                      // create new friend
                     // Friend.findOne({ "facebook.photo": friend.picture.data.url }, (err, f) => {
                      Friend.findOne({ "name": friend.name }, (err, f) => {
                        if (err) {
                          cb();
                          return;
                        } else if (f) { // friend already exists
                          cb();
                          return;
                        } else {
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
                        }
                      });
                    });

                    if (!res.data.paging.next) {
                      return
                    } else {
                      friendsUrl = res.data.paging.next;
                      recur();
                    }
                  })
                  .catch(function(err) {
                    console.log('err', err);
                  })
              }
              recur();
            }

            getFriends();


            // Get friends
            // var items = [];
            //
            // async function getFriends() {
            //   let friends = [], hasNext = true, friendsUrl = 'https://graph.facebook.com/v2.10/me/taggable_friends?access_token=' + accessToken;
            //
            //   while (hasNext) {
            //     await axios.get(friendsUrl)
            //       .then(function(res) {
            //         friends.concat(res.data.data);
            //         items.concat(res.data.data);
            //         console.log('friends', friends)
            //         console.log('res.data.paging.next', res.data.paging.next);
            //
            //         if (!res.data.paging.next) {
            //           hasNext = false;
            //         } else {
            //           friendsUrl = res.data.paging.next;
            //         }
            //       })
            //       .catch(function(err) {
            //         console.log('err', err);
            //       });
            //   }
            //   return friends;
            // }
            //
            // getFriends().then((res) => {
            //   console.log('res', res);
            //   console.log('items', items);
            // });



            // axios.get(friendsUrl) // initial get request
            //   .then(function(res) {
            //     var friends = res.data.data;
            //     friendsUrl = res.data.paging.cursors.next;
            //
            //     //Convert to async
            //     async.each(friends, (friend, cb) => {
            //       // create new friend
            //       Friend.findOne({ "facebook.photo": friend.picture.data.url }, (err, f) => {
            //         if (err) {
            //           cb();
            //           return;
            //         } else if (f) { // friend already exists
            //           cb();
            //           return;
            //         } else {
            //           var newFriend = new Friend({
            //             userId: newUserId,
            //             name: friend.name,
            //             facebook: {
            //               id: friend.id,
            //               photo: friend.picture.data.url
            //             }
            //           });
            //           // save to
            //           newFriend.save((err) => {
            //             if (err) {
            //               return console.log('Err saving user friend: ', friend, err);
            //             }
            //             cb();
            //             return;
            //           })
            //         }
            //       });
            //     });
            //   })
            //   .catch(function(err) {
            //     console.log('Err getting taggable_friends: ', err);
            //   }); // end axios get request

          });
        }
      });
    });
  },
  ));
};
