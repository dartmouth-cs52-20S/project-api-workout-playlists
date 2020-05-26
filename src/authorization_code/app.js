/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

// not sure if i need this
app.use(express.static(`${__dirname}/public`))
  .use(cors())
  .use(cookieParser());

// starts the process of authenticating to user and gets the user’s authorization to access data
// passing to it the client ID, scopes, and redirect URI
app.get('/login', (req, res) => {
  // request auth in auth controller
});

// returns an access token and also a refresh token
// passing to it the authorization code returned by the first call and the client secret key
app.get('/callback', (req, res) => {
  // get tokens in auth controller
});

// a refresh token is sent to ‘/api/token’
// will generate a new access token that we can issue when the previous has expired
app.get('/:refreshToken', (req, res) => {
  // refresh tokens in auth controller
});

console.log('Listening on 8888');
app.listen(8888);
