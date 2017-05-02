const express = require('express');
const path = require('path');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');

// load twitter auth variables
const configAuth = require('./auth');

module.exports = function (passport) {
  // app.use(require('body-parser').urlencoded({ extended: true }));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  });

  // configuration adapted from tutorial: https://scotch.io/tutorials/easy-node-authentication-twitter
  // ********************
  // Twitter ************
  // ********************
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
  },
    function(token, tokenSecret, profile, done) {
      User.findOne({ 'twitter.id': profile.id }, function(err, user) {
        if (err) return done(err);

        if (user) {
          return done(null, user);
        } else {
          // create a new user if one was not found
          let newUser =  new User();

          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }  
  ));
}
