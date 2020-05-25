import { Router } from 'express';
// import spotifyCredentials from 'secrets.js';
import * as UserController from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// router.get('/spotify-credentials', (req, res, next) => {
//   // const clientId = process.env.clientId;
//   // const clientSecret = process.env.clientSecret;
//   // const redirectUri = process.env.redirectUri;
//   // const spotifyCredentials = { clientId, clientSecret, redirectUri };
//   res.json(spotifyCredentials);
// });

// router.route('/authorize')
//   .put(UserController.setUser);

// router.route('/preferences')
//   .put(UserController.userPreferences);

router.route('/newuser')
  .post(UserController.startUser);

router.route('/getuser')
  .get(UserController.getUser);

export default router;