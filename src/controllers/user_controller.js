import User from '../models/user_model';

export const updateUser = (req, res, next) => {
  const { spotifyID } = req.params;
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
  }
};

// get user information
export const getUser = (req, res) => {
  User.findOne({ spotifyID: req.params.spotifyID })
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.send('no user found');
      }
    })
    .catch((error) => { res.status(500).json({ error }); });
};
