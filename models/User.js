const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  twitter: {
    id: String,
    token: String,
    username: String,
    displayName: String,
  },
  placesGoing: [String]
});

const Nightlife_User = mongoose.model('nightlife_user', UserSchema);

module.exports = Nightlife_User;
