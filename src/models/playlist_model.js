import mongoose, { Schema } from 'mongoose';

const PlaylistSchema = new Schema({

  user: { type: Schema.Types.ObjectId, ref: 'User' },

  workoutType: { type: String }, // run, bike, walk, yoga, cardio, etc
  averageTempo: { type: Number }, // chosen bpm: optional, later get this from health app?
  workoutGenre: { type: String }, // can maybe make option for multiple, later
  workoutLength: { type: Number },

  // flags for knowing if users want to amp up energy, loudness, or
  // tempo during beginning, middle, or have it be consistent. Perhaps later we can let users choose
  // at what point during the workout they want to amp up or amp down

  energyFlag: { type: Boolean }, // -1 if beginning, 0 if none, 1 if end
  loudnessFlag: { type: Boolean }, // -1 if beginning, 0 if none, 1 if end
  tempoFlag: { type: Number }, // -1 if beginning, 0 if none, 1 if end

  songs: { type: Array },

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

const PlaylistModel = mongoose.model('Playlist', PlaylistSchema);

export default PlaylistModel;
