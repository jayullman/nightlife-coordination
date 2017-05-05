const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/User');

module.exports = function(userID, locationID) {
  console.log('here');
  User.findById(userID, (err, user) => {
    if (err) throw err;
    console.log(typeof userID);
    let placesGoing = [...user.placesGoing];
    console.log(placesGoing);
    if (placesGoing.indexOf(locationID) === -1) {
      console.log('here!!!');
      placesGoing.push(locationID);
      user.placesGoing = placesGoing;
      user.save((err, user) => {
        if (err) throw err;
        console.log(user);
      });
    }  
  });
}