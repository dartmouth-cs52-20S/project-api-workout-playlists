import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

// and then the secret is usable this way:
// process.env.AUTH_SECRET;


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user), message: 'Sign in Successful!', userId: req.user.id });
};

export const signup = (req, res, next) => {
  const { email } = req.body;
  const { username } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    res.status(422).send('You must provide email and password');
  } else {
    // got help from TA Thomas to clean up this method, later helped Katrina Yu talk through what is happening below.
    User.findOne({ email })
      .then((foundUser) => {
        // if foundUser exists, then send a 400 and say it already exists
        // additional reference for code below https://vegibit.com/node-js-mongodb-user-registration/
        if (foundUser) {
          res.status(400).send('This user already exists!');
        } else {
          const user = new User();
          user.email = email;
          user.username = username;
          user.password = password;

          user.save()
            .then((result) => {
              res.send({ token: tokenForUser(result), message: 'Sign up Successful!', userId: user.id });
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        }
      })
      // catch other errors
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
};


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
