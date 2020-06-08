import axios from 'axios';
import dotenv from 'dotenv';

import User from '../models/user_model';

const stateKey = 'spotify_auth_state';
const request = require('request');

dotenv.config({ silent: true });

// authorization code returned by the first call and the client secret key
export const getTokens = (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;

  res.clearCookie(stateKey);
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {

    if (!error && response.statusCode === 200) {
      const accessToken = body.access_token;
      const refreshToken = body.refresh_token;
      axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((result) => {
          console.log('got spotify id');
          const spotifyID = result.data.id;
          User.findOne({ spotifyID })
            .then((r) => {
              if (r) {
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
                  res.redirect(`${process.env.REDIRECT_URI}/done?message=authSuccess?spotifyID=${spotifyID}`);
                }).catch(() => {
                  res.redirect(`${process.env.REDIRECT_URI}/done?message=authFailure`);
                });
              } else {
                const user = new User({
                  spotifyID,
                  accessToken,
                  refreshToken,
                });
                user.save()
                  .then(() => {
                    res.redirect(`${process.env.REDIRECT_URI}/done?message=authSuccess?token=${accessToken}?spotifyID=${spotifyID}`);
                  })
                  .catch((err) => {
                    res.redirect(`${process.env.REDIRECT_URI}/done?message=authFailure`);
                  });
              }
            })
            .catch((er) => {
              console.log(er);
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
    url: 'https://api.spotify.com/api/token',
    headers: { Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}` },
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
