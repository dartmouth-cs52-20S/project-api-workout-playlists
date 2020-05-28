import axios from 'axios';
// import spotifyCredentials from '../secrets';

import User from '../models/user_model';

const stateKey = 'spotify_auth_state';
const request = require('request');

// const { clientId } = spotifyCredentials; // Your client id
// const { clientSecret } = spotifyCredentials; // Your secret
// const { redirectUri } = spotifyCredentials; // Your redirect uri

// authorization code returned by the first call and the client secret key
export const getTokens = (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  console.log('getting tokens');
  console.log('this is our code', code);

  res.clearCookie(stateKey);
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirectUri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  };
  console.log(redirectUri);
  console.log(authOptions);
  request.post(authOptions, (error, response, body) => {
    console.log('failed to get tokens :(');
    console.log(response.statusCode, 'response status code');
    console.log(response.body);
    if (!error && response.statusCode === 200) {
      const { accessToken } = body;
      const { refreshToken } = body;
      console.log('got tokens!!');
      axios.get('https://accounts.spotify.com/v1/me', accessToken, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => {
          const spotifyID = res.id;
          console.log('got spotifyID');
          User.findOne({ spotifyID })
            .then(() => {
              User.findOneAndUpdate(
                { spotifyID },
                {
                  $set:
                    {
                      accessToken,
                      refreshToken,
                    },
                },
                { new: true },
              ).then(() => {
                res.redirect(`${redirectUri}/done?message=authSuccess?token=${accessToken}?spotifyID=${spotifyID}`);
              }).catch(() => {
                res.redirect(`${redirectUri}/done?message=authFailure`);
              });
            })
            .catch(() => {
              const user = {
                spotifyID,
                accessToken,
                refreshToken,
              };
              user.save()
                .then(() => {
                  res.redirect(`${redirectUri}/done?message=authSuccess?token=${accessToken}?spotifyID=${spotifyID}`);
                })
                .catch(() => {
                  res.redirect(`${redirectUri}/done?message=authFailure`);
                });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

export const refreshTokens = (req, res) => {
// requesting access token from refresh token
  const { refreshToken } = req.params;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` },
    form: {
      grant_type: 'refresh_token',
      refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { accessToken } = body;
      res.send({
        accessToken,
      });
    }
  });
};
