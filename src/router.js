import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as AuthController from './controllers/auth_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// router.route('/authorize')
//   .put(UserController.setUser);

// router.route('/preferences')
//   .put(UserController.userPreferences);

// routes for preliminary new user amd getting user
router.route('/newuser')
  .post(UserController.startUser);

router.route('/getuser/:ID')
  .get(UserController.getUser);

// routes for spotify oauth
router.route('/callback')
  .get(AuthController.getTokens)
  .post(AuthController.getTokens);

router.route('/:accessToken')
  .get(AuthController.refreshTokens);

export default router;
