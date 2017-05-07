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
const bodyParser = require('body-parser');

const updateLocationToUser = require('./helpers/updateLocationToUser');
const updateAttendedLocations = require('./helpers/updateAttendedLocations');

const configPassport = require('./config/passport');
configPassport(passport);

const port = process.env.PORT || 3000;
const app = express();

const connectToDb = require('./helpers/connectToDb');
connectToDb();

app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
app.use(session({
  secret: 'secretword',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

function checkAuth(req, res, next) {
  console.log('checking auth');
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({ isAuthenticated: false });
  }
}

const searchYelp = require('./helpers/searchYelp');

app.get('/search/:location', function(req, res) {
  let location = req.params.location;
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
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
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

const User = require('./models/User');
const AttendedLocation = require('./models/AttendedLocation');

app.get('/retrieveUserInfo', (req, res) => {
  if (req.isAuthenticated()) {
    const userID = req.user;
    let attendedLocations = [];

    User.findById(userID, (err, user) => {
      if (err) throw err;

      const placesUserIsGoing= user.placesGoing;
      const username = user.twitter.displayName;
      res.json({
        placesGoing: placesUserIsGoing,
        username: username
      });
    });

  } else {
    res.sendStatus(401);
  }
});

app.get('/whoisgoing', (req, res) => {
  AttendedLocation.find({}, (err, locations) => {
    if (err) throw err;

    attendedLocations = locations;
    console.log(attendedLocations[0]);
    res.json({
      locations: attendedLocations
    });
  });
});

app.post('/going', (req, res) => {
  const userID = req.user.id;
  const locationID = req.body.locationID;
  const p1 = updateLocationToUser(userID, locationID);
  const p2 = updateAttendedLocations(userID, locationID);

  // return response when all database operations have completed
  Promise.all([p1, p2]).then(() => {
    res.json({ message: 'database operations complete' });
  });
  p1.then(() => { console.log('done!') });
});

app.listen(port, () => {
  console.log(`App is listening on port: ${ port }`);
});
