import { rateLimit } from 'express-rate-limit';

import { MINUTE_MILLIS } from '../constants';

export const requestLimiter = makeLimiter({ windowMs: MINUTE_MILLIS, max: 5 });

export function makeLimiter({ windowMs, max, message }: { windowMs: number; max: number; message?: string }) {
  return rateLimit({
    windowMs,
    max,
    message,
  });
}
