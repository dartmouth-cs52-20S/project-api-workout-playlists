import axios from 'axios';

const playerURL = 'https://api.spotify.com/v1/me/player';

export const getPlayback = (req, res) => {
  axios.get(`${playerURL}`, { headers: { authorization: `Bearer ${req.params.accessToken}` } })
    .then((r) => { res.json(r.data); })
    .catch((error) => { console.log(`spotify api error: ${error}`); });
};

export const sendPlay = (req, res) => {
  // if play for the first time, need to pass in list of uris for playlist, else start where left off
  console.log('req', req);
  axios.get(`${playerURL}/devices`, { headers: { authorization: `Bearer ${req.params.accessToken}` } })
    .then((response) => {
      console.log('see devices', response.data.devices);
      const deviceId = response.data.devices[0].id;
      if (req.body.uris) {
        axios.put(`${playerURL}/play/device_id=${deviceId}`,
          { headers: { authorization: `Bearer ${req.body.user.accessToken}` } },
          { body: { uris: req.body.uris } })
          .then((r) => { return console.log(r); })
          .catch((err) => { return console.log(err); });
      } else {
        axios.put(`${playerURL}/play/device_id=${deviceId}`,
          { headers: { authorization: `Bearer ${req.body.user.accessToken}` } })
          .then((r) => { return console.log(r); })
          .catch((err) => { return console.log(err); });
      }
    })
    .catch((error) => {
      console.log(`spotify api error: ${error}`);
    });
};

export const sendPause = (req, res) => {
  axios.get(`${playerURL}/pause`, { headers: { authorization: `Bearer ${req.params.accessToken}` } })
    .then((res) => { console.log(res); })
    .catch((err) => { return console.log(err); });
};
