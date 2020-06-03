/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import Playlist from '../models/playlist_model';

const spotifyUrl = 'https://api.spotify.com';

// let ids = '';

// function makeIds(track) {
//   ids += `${track.id},`;
// }

// function increasing(a, b) {
//   if (a.audioFeatures.tempo < b.audioFeatures.tempo) return -1;
//   if (a.audioFeatures.tempo > b.audioFeatures.tempo) return 1;
//   return 0;
// }

// function decreasing(a, b) {
//   if (a.audioFeatures.tempo > b.audioFeatures.tempo) return -1;
//   if (a.audioFeatures.tempo < b.audioFeatures.tempo) return 1;
//   return 0;
// }

export const createPlaylist = (req, res) => {
  const range = 0.5;
  const length = Math.floor(req.body.workoutLength / 2) + 1;
  const LENGTH = length;
  getSongs(req, res, length, range, LENGTH);
};

function getSongs(req, res, length, range, LENGTH) {
  const min_tempo = req.body.averageTempo;
  let max_tempo = min_tempo + 5;
  if (req.body.energyFlag !== 0) {
    max_tempo += 5;
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
    .then((response) => {
      console.log('length', response.data.tracks.length);
      if (response.data.tracks.length < length) {
        getSongs(req, res, length - 3, range + 0.25, LENGTH);
      } else {
        const tracks = response.data.tracks.slice(0, Math.min(LENGTH, response.data.tracks.length));
        // tracks.forEach(makeIds);
        // axios.get(`${spotifyUrl}/v1/audio-features/?ids=${ids.substring(0, ids.length - 1)}`, { headers: { authorization: `Bearer ${req.body.user.accessToken}` } })
        //   .then((result) => {
        //     // eslint-disable-next-line no-plusplus
        //     for (let i = 0, len = result.data.audio_features.length; i < len; i++) {
        //       tracks[i].audioFeatures = result.data.audio_features[i];
        //     }
        //     let sortedTracks = tracks;
        //     switch (req.body.energyFlag) {
        //       case (-1):
        //         sortedTracks = tracks.sort(decreasing);
        //         break;
        //       case 1:
        //         sortedTracks = tracks.sort(increasing);
        //         break;
        //       default:
        //         sortedTracks = tracks;
        //         break;
        //     }
        //     // console.log(sortedTracks);
        //     const playlist = new Playlist({
        //       songs: sortedTracks,
        //       user: req.body.user.id,
        //       workoutType: req.body.workoutType,
        //       averageTempo: req.body.averageTempo,
        //       workoutGenre: req.body.workoutGenre,
        //       workoutLength: req.body.workoutLength,
        //       energyFlag: req.body.energyFlag,
        //       loudnessFlag: req.body.loudnessFlag,
        //       tempoFlag: req.body.tempoFlag,
        //     });
        //     playlist.save()
        //       .then((r) => {
        //         res.send(r);
        //       })
        //       .catch(() => {
        //         res.status(500).json({ error: 'could not save playlist to database' });
        //       });
        //   })
        //   .catch((error) => {
        //     console.log(`spotify api get features error: ${error}`);
        //   });
        const playlist = new Playlist({
          songs: tracks,
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
          .then((r) => {
            res.send(r);
          })
          .catch(() => {
            res.status(500).json({ error: 'could not save playlist to database' });
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

const getTrackUris = (playlist) => {
  const uris = [];

  // eslint-disable-next-line array-callback-return
  playlist.songs.map((song) => {
    uris.push(song.uri);
  });

  return uris;
};

// takes spotify id and playlist
export const savePlaylist = (req, res) => {
  axios.post(`${spotifyUrl}/v1/users/${req.body.spotifyID}/playlists`,
    { name: `Tempo: ${req.body.playlist.workoutType} ${req.body.playlist.createdAt}` },
    {
      headers:
      {
        authorization: `Bearer ${req.params.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      const uris = getTrackUris(req.body.playlist);
      axios.post(`${spotifyUrl}/v1/playlists/${result.data.id}/tracks`,
        { uris },
        {
          headers:
      {
        authorization: `Bearer ${req.params.accessToken}`,
        'Content-Type': 'application/json',
      },
        })
        .then((res) => {
          console.log('added songs to playlist with snapshot id:', res);
        })
        .catch(() => { console.log('failed to add songs to playlist'); });
    })
    .catch(() => { console.log('failed to make empty playlist'); });
};
