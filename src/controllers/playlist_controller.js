import Playlist from '../models/playlist_model';
import axios from 'axios';

const spotifyUrl = 'https://api.spotify.com/api';

export const createPlaylist = (req, res) => {
    const playlist = new Playlist({
      user: req.user,
      workoutType: req.body.workoutType,
      averageTempo: req.body.averageTempo,
      workoutGenre: req.body.workoutGenre,
      energyFlag: req.body.energyFlag,
      loudnessFlag: req.body.loudnessFlag,
      tempoFlag: req.body.tempoFlag,
    });

    const min_tempo = playlist.averageTempo;
    if (tempoFlag !== 0) {
        const max_tempo = min_tempo + 10;
    } else {
        const max_tempo = min_tempo;
    }

    // if energy flag sort after get songs
    if (playlist.user.energy) {
        const min_energy = 0.7;
    } else {
        const min_energy = 0.3;
    }
    const max_energy = min_energy + 0.3

    // if loud flag sort after get songs
    if (playlist.user.loudness) {
        const min_loudness = -20;
    } else {
        const min_loudness = -40;
    }
    const max_loudness = min_loudness + 20

    if (playlist.user.accousticness) {
        const min_accousticness = 0.75;
    } else {
        const min_accousticness = 0;
    }
    const max_accousticness = min_accousticness + 0.25

    if (playlist.user.danceability) {
        const min_danceability = 0.5;
    } else {
        const min_danceability = 0;
    }
    const max_danceability= min_danceability + 0.5

    if (playlist.user.instrumentalness) {
        const min_instrumentalness = 0.5;
    } else {
        const min_instrumentalness = 0;
    }
    const max_instrumentalness = min_instrumentalness + 0.5

    if (playlist.user.liveness) {
        const min_liveness = 0.5;
    } else {
        const min_liveness = 0;
    }
    const max_liveness = min_liveness + 0.5

    if (playlist.user.popularity) {
        const min_popularity = 50;
        const max_popularity = min_popularity + 50
    } else {
        const min_popularity = 0;
        const max_popularity = min_popularity + 75
    }

    if (playlist.user.valence) {
        const min_valence = 0.5;
    } else {
        const min_valence = 0;
    }
    const max_valence = min_valence + 0.5


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
        }
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
