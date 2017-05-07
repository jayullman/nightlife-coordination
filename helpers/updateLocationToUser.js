const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/User');

module.exports = function(userID, locationID) {
  return User.findById(userID, (err, user) => {
    if (err) throw err;
    let placesGoing = [...user.placesGoing];
    const index = placesGoing.indexOf(locationID)

    // add location to array if it does not exist
    if (index === -1) {
      placesGoing.push(locationID);
      
    // remove location from array if already exists
    } else {
      placesGoing.splice(index, 1);
    }

    user.placesGoing = placesGoing;
    user.save((err, user) => {
      if (err) throw err;
    });
  });
}