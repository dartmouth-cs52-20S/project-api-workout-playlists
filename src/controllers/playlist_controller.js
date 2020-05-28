/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import Playlist from '../models/playlist_model';

const spotifyUrl = 'https://api.spotify.com/';

export const createPlaylist = (req, res) => {
  console.log('req', req);
  const playlist = new Playlist({
    user: req.body.user,
    workoutType: req.body.workoutType,
    averageTempo: req.body.averageTempo,
    workoutGenre: req.body.workoutGenre,
    energyFlag: req.body.energyFlag,
    loudnessFlag: req.body.loudnessFlag,
    tempoFlag: req.body.tempoFlag,
  });

  const min_tempo = playlist.averageTempo;
  let max_tempo = min_tempo;
  if (playlist.tempoFlag !== 0) {
    max_tempo += 10;
  }

  // if energy flag sort after get songs
  const min_energy = Math.max(playlist.user.energy - 0.05, 0);
  const max_energy = Math.min(playlist.user.energy + 0.05, 1);

  // if loud flag sort after get songs
  const min_loudness = Math.max((-(playlist.user.loudness * 60) - 60) - 10, -60); // oop does this interval look right
  const max_loudness = Math.min((-(playlist.user.loudness * 60) - 60) + 10, 0);

  const min_accousticness = Math.max(playlist.user.accousticness - 0.05, 0);
  const max_accousticness = Math.min(playlist.user.accousticness + 0.05, 1);

  const min_danceability = Math.max(playlist.user.danceability - 0.05, 0);
  const max_danceability = Math.min(playlist.user.danceability + 0.05, 1);

  const min_instrumentalness = Math.max(playlist.user.instrumentalness - 0.05, 0);
  const max_instrumentalness = Math.min(playlist.user.instrumentalness + 0.05, 1);

  const min_liveness = Math.max(playlist.user.liveness - 0.05, 0);
  const max_liveness = Math.min(playlist.user.liveness + 0.05, 1);

  const min_popularity = Math.max(playlist.user.popularity * 100 - 25, 0);
  const max_popularity = Math.min(playlist.user.popularity * 100 + 75, 100);

  const min_valence = Math.max(playlist.user.valence - 0.05, 0);
  const max_valence = Math.min(playlist.user.valence + 0.05, 1);


  axios.get(`${spotifyUrl}/v1/recommendations`, {
    params: {
      authorization: playlist.user.accessToken,
      seed_genres: playlist.workoutGenre,
      min_tempo,
      max_tempo,
      min_energy,
      max_energy,
      min_loudness,
      max_loudness,
      min_accousticness,
      max_accousticness,
      min_danceability,
      max_danceability,
      min_instrumentalness,
      max_instrumentalness,
      min_liveness,
      max_liveness,
      min_popularity,
      max_popularity,
      min_valence,
      max_valence,
    },
    headers: { authorization: `Bearer ${playlist.user.accessToken}` },
  })
    .then((response) => {
      playlist.songs = response;
    })
    .catch((error) => {
      console.log(error);
    });


  playlist.save()
    .then((result) => {
      res.json({ message: 'Playlist created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
