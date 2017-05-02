/* Authorization Header
Authorization:
Bearer ACCESS_TOKEN
*/

/* 
API endpoint for bars and location search
https://api.yelp.com/v3/businesses/search?categories=bars&location=portland, or
*/

// set up environment variables using .env file
require('dotenv').config()


const location = 'portland, or'
const API_ENDPOINT =`https://api.yelp.com/v3/businesses/search?categories=bars&location=${ location }`;


const express = require('express');
const path = require('path');
const axios = require('axios');
const passport = require('passport');

const configPassport = require('./config/passport');
configPassport(passport);

const port = process.env.PORT || 3000;
const app = express();

const connectToDb = require('./controllers/connectToDb');
connectToDb();

app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
app.use(session({
  secret: 'secretword',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());

// function isUserLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.json({ message: 'User is logged in'});
//   } else {
//     res.json({ message: 'User is not logged in' });
//   }
// }

const searchYelp = require('./controllers/searchYelp');
app.get('/searchtest', function(req, res) {
  let location = 97216;

  searchYelp(location)
    .then((results) => {
      res.send(results);
    });
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/failure'
  }));

app.get('/failure', (req, res) => {
  res.send('Authentication Failed');
});

// logs user out of current session
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.redirect('/auth/twitter');
});

app.get('/amiauthenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'User is logged in' });
  } else {
    res.json({ message: 'User is not logged in' });
  }
});

app.get('/whoami', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(
      {
        name: req.user.twitter.username
      });
  }
});

app.listen(port, () => {
  console.log(`App is listening on port: ${ port }`);
});
