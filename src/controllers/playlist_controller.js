/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import Playlist from '../models/playlist_model';

const spotifyUrl = 'https://api.spotify.com';

export const createPlaylist = (req, res) => {
  console.log('into create playlist BE');
  const range = 0.5;
  const length = Math.floor(req.body.workoutLength / 2) + 1;
  const LENGTH = length;
  getSongs(req, res, length, range, LENGTH);
};

function getSongs(req, res, length, range, LENGTH) {
  const min_tempo = req.body.averageTempo;
  let max_tempo = min_tempo;
  if (req.body.tempoFlag !== 0) {
    max_tempo += 10;
  }

  const min_acousticness = Math.max(req.body.user.acousticness - range, 0);
  const max_acousticness = Math.min(req.body.user.acousticness + range, 1);

  const min_instrumentalness = Math.max(req.body.user.instrumentalness - range, 0);
  const max_instrumentalness = Math.min(req.body.user.instrumentalness + range, 1);

  const min_liveness = Math.max(req.body.user.liveness - range, 0);
  const max_liveness = Math.min(req.body.user.liveness + range, 1);

  const min_popularity = Math.trunc(Math.max(req.body.user.popularity * 100 - 50, 0));
  const max_popularity = Math.trunc(Math.min(req.body.user.popularity * 100 + 50, 100));

  const min_valence = Math.max(req.body.user.valence - range, 0);
  const max_valence = Math.min(req.body.user.valence + range, 1);

  axios.get(`${spotifyUrl}/v1/recommendations`, {
    params: {
      limit: 100,
      seed_genres: req.body.workoutGenre,
      min_tempo,
      max_tempo,
      min_energy: 0.5,
      max_energy: 1,
      min_acousticness,
      max_acousticness,
      min_instrumentalness,
      max_instrumentalness,
      min_liveness,
      max_liveness,
      min_popularity,
      max_popularity,
      min_valence,
      max_valence,
    },
    headers: { authorization: `Bearer ${req.body.user.accessToken}` },
  })
    // eslint-disable-next-line no-loop-func
    .then((response) => {
      console.log('length', response.data.tracks.length);
      if (response.data.tracks.length < length) {
        getSongs(req, res, length - 3, range + 0.25, LENGTH);
      } else {
        console.log(Math.min(LENGTH, response.data.tracks.length));
        const playlist = new Playlist({
          songs: response.data.tracks.slice(0, Math.min(LENGTH, response.data.tracks.length)),
          user: req.body.user.id,
          workoutType: req.body.workoutType,
          averageTempo: req.body.averageTempo,
          workoutGenre: req.body.workoutGenre,
          workoutLength: req.body.workoutLength,
          energyFlag: req.body.energyFlag,
          loudnessFlag: req.body.loudnessFlag,
          tempoFlag: req.body.tempoFlag,
        });
        playlist.save()
          .then((result) => {
            console.log('creating playlist at end');
            res.send(result);
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export const getPlaylist = (req, res) => {
  Playlist.findById(req.params.playlistID)
    .populate('user')
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPlaylists = (req, res) => {
  Playlist.find()
    .populate('user')
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
