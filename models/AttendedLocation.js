// this model will store an array of locations that currently have 
// users attending them

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AttendedLocationSchema = new mongoose.Schema({
  locationID: String,
  usersAttending: [String]
});

const AttendedLocation = mongoose.model('attended-location', AttendedLocationSchema);

module.exports = AttendedLocation;
