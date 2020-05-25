import { Router } from 'express';
import spotifyCredentials from 'router.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// comments will be needed in deployment
router.get('/spotify-credentials', (req, res, next) => {
  // const clientId = process.env.clientId;
  // const clientSecret = process.env.clientSecret;
  // const redirectUri = process.env.redirectUri;
  // const spotifyCredentials = { clientId, clientSecret, redirectUri };
  res.json(spotifyCredentials);
});

router.route('/authorize')
  .put(setUser);

router.route('/preferences')
  .put(userPreferences);

router.route('/userModel')
  .put(makeUser);

export default router;