import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({

  accessToken: { type: String },
  refreshToken: { type: String },
  spotifyID: {type: String },

  genres: { type: Array }, // array of favorite genres

  // comments describe features in spotify api, but held in booleans

  // accoustic?
  acousticness: { type: Boolean }, // confidence measure from 0.0 to 1.0 of whether the track is acoustic
  // do you like to dance to your music?
  danceability: { type: Boolean }, // 0.0 is least danceable and 1.0 is most danceable
  // energetic? energetic tracks feel fast, loud, and noisy
  energy: { type: Boolean }, // measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity
  // instrumental?
  instrumentalness: { type: Boolean }, // above 0.5 intended instrumental tracks, but confidence is higher as the value approaches 1.0
  // live music?
  liveness: { type: Boolean }, // in api, value above 0.8 provides strong likelihood that the track is live
  // do you like your music loud?
  loudness: { type: Boolean }, // values typical range between -60 and 0 db
  // popular music?
  popularity: { type: Boolean }, // value between 0 and 100, with 100 being the most popular
  // positive, upbeat, happy music?
  valence: { type: Boolean }, // measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track

}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      // delete ret.password;
      // delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
