import { Router } from 'express';
import { requireAuth, requireSignin } from './services/passport';
import s3Handle from './services/s3';
import user from './controllers/user_controller';
/* To add Post and User Controller */


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// /your routes will go here
/*
To Add content here

*/

router.route('/auth')
  .get(requireAuth, user);

router.post('/signin', requireSignin, user.signIn);
router.post('/signup', user.signUp);

router.get('/sign-s3', s3Handle);

export default router;