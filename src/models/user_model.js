import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({

  // will be needed once auth is up and runnign
  accessToken: { type: String },
  refreshToken: { type: String },
  spotifyID: { type: String },

  genres: { type: Array }, // array of favorite genres
  acousticness: { type: Number }, // confidence measure from 0.0 to 1.0 of whether the track is acoustic
  instrumentalness: { type: Number }, // above 0.5 intended instrumental tracks, but confidence is higher as the value approaches 1.0
  liveness: { type: Number }, // in api, value above 0.8 provides strong likelihood that the track is live
  loudness: { type: Number }, // values typical range between -60 and 0 db
  popularity: { type: Number }, // value between 0 and 100, with 100 being the most popular
  valence: { type: Number }, // measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track

}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
