import { Document } from 'mongoose';

export interface IUserLeaderboard extends Document {
  address: string;
  winnings: number;
  races: number;
}

export interface IUserLeaderboardResult {
  position: number;
  address: string;
  winnings: number;
  races: number;
}

export interface INftLeaderboard extends Document {
  address: string;
  nftId: string;
  winnings: number;
  races: number;
}

export interface INftLeaderboardResult {
  position: number;
  address: string;
  nftId: string;
  owner?: string;
  winnings: number;
  races: number;
}

export interface ILeaderboardRace extends Document {
  raceId: string;
  blockNumber: number;
}
