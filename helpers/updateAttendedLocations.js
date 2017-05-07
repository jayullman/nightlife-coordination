const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AttendedLocation = require('../models/AttendedLocation');

module.exports = function (userID, locationID) {
  return AttendedLocation.findOne({ locationID: locationID }, (err, location) => {
    if (err) {
      console.log(err)
    }

    // if location does not exist, create new location
    if (!location) {
      newLocation = new AttendedLocation({
        locationID: locationID,
        usersAttending: [userID]
      });

      newLocation.save((err, location) => {
        if (err) throw err;
      });

    // if location exists, update array with the user attending
    } else {
    
      let updatedUsersAttending = [...location.usersAttending];
      const index = updatedUsersAttending.indexOf(userID);

      // add user to array if it does not exist
      if (index === -1) {
        updatedUsersAttending.push(userID);

        // remove location from array if already exists
      } else {
        updatedUsersAttending.splice(index, 1);
      }

      // if there are no users attending, remove record. Otherwise update location record
      if (updatedUsersAttending.length === 0) {
        location.remove();
      } else {
        location.usersAttending = updatedUsersAttending;
        location.save((err, location) => {
          if (err) throw err;
        });
      }
    }
  });
}
