import { model, Schema } from 'mongoose';

import { ILeaderboardRace } from '../types';

const LeaderboardRaceSchema = new Schema({
  raceId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  blockNumber: {
    type: Number,
    required: true,
    index: true,
  },
});

export const LeaderboardRace = model<ILeaderboardRace>('LeaderboardRace', LeaderboardRaceSchema);
