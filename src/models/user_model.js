import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

// and then the secret is usable this way:
// process.env.AUTH_SECRET

// create a UserSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String },
  password: { type: String },
}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
});

// create UserModel class from schema


UserSchema.pre('save', function beforeUserModelSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  if (!user.isModified('password')) return next();
  // generate a salt
  const salt = bcrypt.genSaltSync(10);

  // hash user password with the salt
  const hash = bcrypt.hashSync(user.password, salt);

  // set password to hashed password
  user.password = hash;
  return next();
});

//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, result) => {
    if (error) {
      return callback(error);
    }
    return callback(null, result);
  });
};


const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
