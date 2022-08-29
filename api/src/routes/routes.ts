import express from 'express';

import { requestLimiter } from '../middleware';
import { leaderboardController } from '../controllers';

const router = express.Router();

router.get('/leaderboard/user', requestLimiter, leaderboardController.userLeaderboard);
router.get('/leaderboard/user/:address', requestLimiter, leaderboardController.userLeaderboardPosition);

router.get('/leaderboard/nft', requestLimiter, leaderboardController.nftLeaderboard);

export { router };
