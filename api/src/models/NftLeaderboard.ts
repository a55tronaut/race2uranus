import { model, Schema } from 'mongoose';

import { INftLeaderboard } from '../types';

const NftLeaderboardSchema = new Schema({
  address: {
    type: String,
    required: true,
    index: true,
  },
  nftId: {
    type: String,
    required: true,
    index: true,
  },
  owner: {
    type: String,
  },
  earnings: {
    type: Number,
    required: true,
    default: 0,
  },
  wins: {
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

export const NftLeaderboard = model<INftLeaderboard>('NftLeaderboard', NftLeaderboardSchema);
