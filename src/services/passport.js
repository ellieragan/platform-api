import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// eslint-disable-next-line import/no-unresolved
import dotenv from 'dotenv';

import User from '../models/user_model';

// loads in .env file if needed
dotenv.config({ silent: true });

// options for local strategy, we'll use email AS the username
// not have separate ones
const localOptions = { usernameField: 'email' };

// options for jwt strategy
// we'll pass in the jwt in an `authorization` header
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};
// NOTE: we are not calling this a bearer token (although it technically is), if you see people use Bearer in front of token on the internet you could either ignore it, use it but then you have to parse it out here as well as prepend it on the frontend.

// username/email + password authentication strategy
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  // 🚀 TODO: should find user by email and check password
  let user;
  let isMatch;

  try {
    // searches for a user with the provided email and assigns it to the user variable
    user = await User.findOne({ email });
    // if a user w the provided email is not found, call done w false to show that the authentication was unsuccessful
    if (!user) {
      return done(null, false);
    }
    // compares the given password with the user's password stored in the database; stores result in isMatch
    isMatch = await user.comparePassword(password);
    // sees if isMatch is false (meaning password was wrong) and, if so, calls done w false to show that the authentication was unsuccessful
    if (!isMatch) {
      return done(null, false);
    } else {
      // calls done with the user parameter to show auth was successful
      return done(null, user);
    }
  } catch (error) {
    // calls done with error to show that auth encountered an error
    return done(error);
  }
});

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // 🚀 TODO: is called with confirmed jwt we just need to confirm that user exits
  let user;
  try {
    user = await User.findById(payload.sub);
  } catch (error) {
    done(error, false);
  }
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// Tell passport to use this strategy
passport.use(jwtLogin); // for 'jwt'
passport.use(localLogin); // for 'local'

// middleware functions to use in routes
export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
