const cbURL = process.env.cbURL || 'http://127.0.0.1:3000/auth/twitter/callback'

module.exports = {
  twitterAuth: {
    consumerKey: 'IuX2kh4D44j4PLeR1QcRZqmw1',
    consumerSecret: 'OAiUtcFLcdED1MAdD48SgsvBlagmzivBYzOGkeE3dD8HzkwCjI',
    callbackURL: cbURL
  }
}