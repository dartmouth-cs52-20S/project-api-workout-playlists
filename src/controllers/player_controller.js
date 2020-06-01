import axios from 'axios';

const playerURL = 'https://api.spotify.com/v1/me/player';

export const getPlayback = (req, res) => {
  console.log('token: ', req.params.accessToken);
  axios.get(`${playerURL}`, { headers: { authorization: `Bearer ${req.params.accessToken}` } })
    .then((r) => { res.json(r.data); })
    .catch((error) => { console.log(`spotify api get error: ${error}`); });
};

export const sendPlay = (req, res) => {
  // if play for the first time, need to pass in list of uris for playlist, else start where left off
  console.log('in sendPlay', { uris: req.body });
  axios.get(`${playerURL}/devices`, { headers: { authorization: `Bearer ${req.params.accessToken}` } })
    .then((response) => {
      console.log('see devices', response.data.devices);
      const deviceId = response.data.devices[0].id;
      axios.put(`${playerURL}/play/?device_id=${deviceId}`, { uris: req.body },
        { headers: { authorization: `Bearer ${req.params.accessToken}` } })
        .then(() => { return console.log('should b playin rn'); })
        .catch((err) => { return console.log('play error: ', err); });
    })
    .catch((error) => {
      console.log(`spotify api device error: ${error}`);
    });
};

export const sendPause = (req, res) => {
  axios.put(`${playerURL}/pause`, {}, { headers: { authorization: `Bearer ${req.params.accessToken}` } })
    .then((res) => { console.log('paused'); })
    .catch((err) => { console.log(err); });
};
