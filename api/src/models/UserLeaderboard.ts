import { model, Schema } from 'mongoose';

import { IUserLeaderboard } from '../types';

const UserLeaderboardSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  winnings: {
    type: Number,
    required: true,
    default: 0,
  },
  races: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const UserLeaderboard = model<IUserLeaderboard>('UserLeaderboard', UserLeaderboardSchema);
