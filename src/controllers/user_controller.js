import User from '../models/user_model';
import axios from 'axios';

const spotifyUrl = 'https://api.spotify.com/api';

// for preliminary testing between front and back
export const startUser = (req, res, next) => {
  const { spotifyID } = req.body;
  const { genres } = req.body;
  const { acousticness } = req.body;
  const { instrumentalness } = req.body;
  const { liveness } = req.body;
  const { loudness } = req.body;
  const { popularity } = req.body;
  const { valence } = req.body;

  if (!spotifyID) {
    res.status(422).send('error');
  } else {
    const user = new User({
      spotifyID,
      genres,
      acousticness,
      instrumentalness,
      liveness,
      loudness,
      popularity,
      valence,
    });
    user.save()
  }
};

// get user information
export const getUser = (req, res) => {
  User.findOne( { spotifyID: req.body.spotifyID } )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// setting user once spotify auth is up and running: not tested!
export const setUser = (req, res, next) => {
  const { accessToken } = req.body;
  const { refreshToken } = req.body;

  if (!accessToken|| !refreshToken) {
    res.status(422).send('error');
  } else {
    axios.get(`${spotifyUrl}/v1/me`, accessToken)
      .then((response) => {
        const spotifyID = response.id
        User.findOne({ spotifyID })
          .then((result) => {
            if (result) {
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
              ).then((result) => {
                  res.send(result);
                }).catch((error) => {
                  res.status(500).json({ error });
                });
            } else {
              const user = new User({
                accessToken,
                refreshToken,
                spotifyID,
              });
              user.save()
                .then(() => {
                  res.json({ message: 'user saved'})
                })
                .catch((error) => {
                  res.status(500).json({ error });
                });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

// once spotify auth is up we set preferences this way: not tested!
export const setUserPreferences = (req, res, next) => {
  const { spotifyID } = req.body;
  const { genres } = req.body;
  const { acousticness } = req.body;
  const { instrumentalness } = req.body;
  const { liveness } = req.body;
  const { loudness } = req.body;
  const { popularity } = req.body;
  const { valence } = req.body;

  User.findOneAndUpdate(
    { spotifyID },
    {
      $set:
             {
              genres,
              acousticness,
              instrumentalness,
              liveness,
              loudness,
              popularity,
              valence,
             },
    },
    { new: true },
  ).then((result) => {
      res.send(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};