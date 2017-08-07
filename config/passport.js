const configAuth = require('./auth');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
  // passport.use(new FacebookStrategy({
  //     clientId: configAuth.facebookAuth.clientId,
  //     clientSecret: configAuth.facebookAuth.clientSecret,
  //     callbackURL: configAuth.facebookAuth.callbackUrl
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //     User.findOrCreate(..., function(err, user) {
  //       if (err) { return done(err); }
  //       done(null, user);
  //     });
  //   }
  // ));
};