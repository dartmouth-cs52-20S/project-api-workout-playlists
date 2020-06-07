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

// playlist controller routes
router.route('/playlist')
  .post(PlaylistController.createPlaylist);

router.route('/playlists/:id')
  .get(PlaylistController.getPlaylists)
  .put(PlaylistController.updatePlaylist);

router.post('/save/:accessToken', PlaylistController.savePlaylist);

router.route('/playlist/:playlistID')
  .get(PlaylistController.getPlaylist)
  .delete(PlaylistController.deletePlaylist);

// player controller routes
router.get('/playback/:accessToken', PlayerController.getPlayback);
router.put('/play/:accessToken', PlayerController.sendPlay);
router.put('/pause/:accessToken', PlayerController.sendPause);
router.post('/next/:accessToken', PlayerController.sendNext);

router.route('/:accessToken')
  .get(AuthController.refreshTokens);

export default router;
