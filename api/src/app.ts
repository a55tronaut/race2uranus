import express from 'express';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import 'express-async-errors';

import { LOG_LEVEL, UI_URL } from './env';
import { ApplicationError } from './errors';
import { router } from './routes';
import logger from './logger';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || UI_URL.match(origin) || /https?:\/\/localhost/i.test(origin)) {
      logger.debug(`CORS request allowed from origin ${origin} (UI URL: ${UI_URL})`);
      callback(null, true);
    } else {
      logger.debug(`CORS request DENIED from origin ${origin} (UI URL: ${UI_URL})`);
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use(
  expressWinston.logger({
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    transports: [new winston.transports.Console()],
  }),
);

app.use((err: ApplicationError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: LOG_LEVEL === 'debug' ? err : err.message,
    message: err.message,
  });
});

app.use('/', router);

export default app;
