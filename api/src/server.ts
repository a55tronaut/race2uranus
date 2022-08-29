import * as http from 'http';
import mongoose from 'mongoose';

import { DB_URI, PORT } from './env';
import app from './app';
import logger from './logger';

main();

async function main() {
  await mongoose.connect(DB_URI);
  logger.info(`Connected to DB`);
  http.createServer(app).listen(PORT, () => {
    logger.info(`Express server listening on port ${PORT}`);
  });
}
