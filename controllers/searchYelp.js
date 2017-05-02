const axios = require('axios');

// returns a promise with yelp data with passed in location data
module.exports = function( location ) {
  return axios.get(
    `https://api.yelp.com/v3/businesses/search?categories=bars&location=${ location }`,
    {
      headers: { Authorization: process.env.AUTH_HEADER }
    }
  )
    .then(({ data }) => {
      return data.businesses;
    })
    .catch((err) => {
      console.log(err);
    });
}