import axios from 'axios';

import { API_URL } from '../env';
import { INftLeaderboardResult } from '../types';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const race2UranusApi = {
  getNftLeaderboard: withErrorHandler(async (): Promise<INftLeaderboardResult[]> => {
    const { data } = await api.get('/leaderboard/nft');

    return data;
  }),
};
