import { Request, Response } from 'express';

import { leaderboardService } from '../services';

export const leaderboardController = {
  userLeaderboard,
  userLeaderboardPosition,
  nftLeaderboard,
};

async function userLeaderboard(req: Request, res: Response) {
  const leaderboard = await leaderboardService.getUserLeaderboard();
  return res.send(leaderboard);
}

async function userLeaderboardPosition(req: Request, res: Response) {
  const leaderboardPosition = await leaderboardService.getUserLeaderboardPosition(req.params.address);
  return res.send(leaderboardPosition);
}

async function nftLeaderboard(req: Request, res: Response) {
  const leaderboard = await leaderboardService.getNftLeaderboard();
  return res.send(leaderboard);
}
