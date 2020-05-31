import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as AuthController from './controllers/auth_controller';
import * as PlaylistController from './controllers/playlist_controller';
import * as PlayerController from './controllers/player_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// user controller routes
router.route('/update/:spotifyID')
  .put(UserController.updateUser);

router.route('/getuser/:spotifyID')
  .get(UserController.getUser);

// auth controller routes
router.route('/callback')
  .get(AuthController.getTokens)
  .post(AuthController.getTokens);

router.route('/:accessToken')
  .get(AuthController.refreshTokens);

// playlist controller routes
router.route('/playlist')
  .post(PlaylistController.createPlaylist)
  .get(PlaylistController.getPlaylists);

router.route('/playlist/:playlistID')
  .get(PlaylistController.getPlaylist);

// player controller routes
router.get('/playback/:token', PlayerController.getPlayback);
router.put('/play/:token', PlayerController.sendPlay);
router.put('/pause/:token', PlayerController.sendPause);


export default router;
