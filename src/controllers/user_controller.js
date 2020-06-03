import axios from 'axios';
import User from '../models/user_model';

const spotifyUrl = 'https://api.spotify.com';

const genres = [];

function pushGenre(genre) {
  genres.push(genre);
}

function makeGenres(artist) {
  artist.genres.forEach(pushGenre);
}

function frequency(arr) {
  const a = []; const b = []; let prev;

  arr.sort();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      // eslint-disable-next-line no-plusplus
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
}

export const updateUser = (req, res, next) => {
  axios.get(`${spotifyUrl}/v1/me/top/artists?time_range=medium_term`, { headers: { authorization: `Bearer ${req.body.accessToken}` } })
    .then((result) => {
      result.data.items.forEach(makeGenres);
      const frequencies = frequency(genres);
      const topGenres = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < frequencies[1].length; i++) {
        if (frequencies[1][i] >= 2) {
          topGenres.push(frequencies[0][i]);
        }
      }
      const { spotifyID } = req.params;
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
            genres: topGenres,
            acousticness,
            instrumentalness,
            liveness,
            loudness,
            popularity,
            valence,
          },
          },
          { new: true },
        ).then((r) => {
          res.send(r);
        }).catch((error) => {
          res.status(500).json({ error });
        });
      }
    })
    .catch((error) => {
      console.log(`spotify api get error: ${error}`);
    });
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
    .catch(() => { res.status(500).json({ error: 'Could not find user' }); });
};
