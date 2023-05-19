// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jwt-simple';
// eslint-disable-next-line import/no-extraneous-dependencies
// import bcrypt from 'bcryptjs';
import dotenv from '../secret.env';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const signin = (user) => {
  return tokenForUser(user);
};

// note the lovely destructuring here indicating that we are passing in an object with these 3 keys
export const signup = async ({ email, password }, author) => {
  if (!email || !password) {
    throw new Error('You must provide email and password');
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is in use');
  }

  // 🚀 TODO:
  // here you should use the User model to create a new user.
  // this is similar to how you created a Post
  // and then save and return a token

  const user = new User();
  user.email = { email };
  user.password = { password };
  user.author = author;

  await user.save();
  return tokenForUser(user);
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
