const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var routes = require('./app/routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect React
app.use(express.static(path.join(__dirname, './react-client/dist')));

// Passport
require('./config/passport')(passport);
app.use(cookieParser());
app.use(session({ secret: 'oompaloompa' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/', routes);

// Auth routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends'] }));

// app.get('/auth/facebook', passport.authenticate('facebook', {
//   scope: ['email'],
//   profileFields: ['emails', 'name', 'id'],
// }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/', // TODO may need to change this
    failureRedirect: '/',
  }));


app.get('/profile', (req, res) => {
  res.send('Logged in!');
});


app.get('/login', (req, res) => {
  // res.sendFile(path.join(__dirname, '/react-client/dist/login.html'));
  res.send();
});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});

