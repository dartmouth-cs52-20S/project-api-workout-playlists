/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import Playlist from '../models/playlist_model';

const spotifyUrl = 'https://api.spotify.com';

export const createPlaylist = (req, res) => {
  console.log('into create playlist BE');
  const min_tempo = req.body.averageTempo;
  let max_tempo = min_tempo;
  if (req.body.tempoFlag !== 0) {
    max_tempo += 10;
  }
  // if energy flag sort after get songs
  // const min_energy = Math.max(req.body.user.energy - 0.05, 0);
  // const max_energy = Math.min(req.body.user.energy + 0.05, 1);


  // const min_danceability = Math.max(req.body.user.danceability - 0.05, 0);
  // const max_danceability = Math.min(req.body.user.danceability + 0.05, 1);

  // Use edie's mood question here

  // if loud flag sort after get songs
  // const min_loudness = Math.max((-(req.body.user.loudness * 60) - 60) - 10, -60); // oop does this interval look right
  // const max_loudness = Math.min((-(req.body.user.loudness * 60) - 60) + 10, 0);

  const min_acousticness = Math.max(req.body.user.acousticness - 0.5, 0);
  const max_acousticness = Math.min(req.body.user.acousticness + 0.5, 1);


  // const min_instrumentalness = Math.max(req.body.user.instrumentalness - 0.05, 0);
  // const max_instrumentalness = Math.min(req.body.user.instrumentalness + 0.05, 1);

  const min_liveness = Math.max(req.body.user.liveness - 0.5, 0);
  const max_liveness = Math.min(req.body.user.liveness + 0.5, 1);

  const min_popularity = Math.trunc(Math.max(req.body.user.popularity * 100 - 50, 0)); // round off
  const max_popularity = Math.trunc(Math.min(req.body.user.popularity * 100 + 90, 100));

  const min_valence = Math.max(req.body.user.valence - 0.5, 0);
  const max_valence = Math.min(req.body.user.valence + 0.5, 1);

  axios.get(`${spotifyUrl}/v1/recommendations`, {
    params: {
      // authorization: req.body.user.accessToken,
      limit: 10,
      seed_genres: req.body.workoutGenre, // COME BACK TO THIS
      min_tempo,
      max_tempo,
      min_energy: 0.5,
      max_energy: 1,
      // min_loudness,
      // max_loudness,
      min_acousticness,
      max_acousticness,
      // // // min_danceability,
      // // // max_danceability,
      // min_instrumentalness,
      // max_instrumentalness,
      min_liveness,
      max_liveness,
      min_popularity,
      max_popularity,
      min_valence,
      max_valence,
    },
    headers: { authorization: `Bearer ${req.body.user.accessToken}` },
  })
    .then((response) => {
      console.log('creating playlist at end');
      const playlist = new Playlist({
        songs: response.data.tracks,
        user: req.body.user.id,
        workoutType: req.body.workoutType,
        averageTempo: req.body.averageTempo,
        workoutGenre: req.body.workoutGenre,
        energyFlag: req.body.energyFlag,
        loudnessFlag: req.body.loudnessFlag,
        tempoFlag: req.body.tempoFlag,
      });
      playlist.save()
        .then((result) => {
          res.send(result);
          // res.json({ message: 'Playlist created!' });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPlaylist = (req, res) => {
  console.log('in playlist controller');
  console.log('playlist id', req.params.playlistID);
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
  console.log('into get playlists BE');
  Playlist.find()
    .populate('user')
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
