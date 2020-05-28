import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as AuthController from './controllers/auth_controller';
import * as PlaylistController from './controllers/playlist_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

router.route('/update/:spotifyID')
  .put(UserController.updateUser);

router.route('/getuser/:spotifyID')
  .get(UserController.getUser);

// routes for spotify oauth
router.route('/callback')
  .get(AuthController.getTokens)
  .post(AuthController.getTokens);

router.route('/:accessToken')
  .get(AuthController.refreshTokens);

router.route('/makeplaylist')
  .post(PlaylistController.createPlaylist);

export default router;
