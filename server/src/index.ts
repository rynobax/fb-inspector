require('source-map-support').install();
require('dotenv').config();
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY,
  });
}

import { start } from './server';

start();
