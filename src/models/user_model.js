import mongoose, { Schema } from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
import dotenv from '../secret.env';

dotenv.config({ silent: true });

// and then the secret is usable this way:
// process.env.AUTH_SECRET

// create a PostSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
  author: String,
}, {
  toobject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

UserSchema.pre('save', async function beforeUserSave(next) {
  // const bcrypt = require('bcryptjs');

  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // TODO: do stuff here
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// note use of named function rather than arrow notation, required here
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const comparison = await bcrypt.compare(candidatePassword, this.password);
  return comparison;
};

// create PostModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
