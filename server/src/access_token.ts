require('source-map-support').install();
require('dotenv').config();
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY,
  });
}

import { getAccessToken, isErrorRes } from './access_token/server';

export interface Event {
  queryStringParameters: {
    [key: string]: string | undefined;
  };
}

exports.handler = function(ev: Event, _context: any, callback: any) {
  getAccessToken(ev.queryStringParameters).then(res => {
    callback(null, {
      statusCode: isErrorRes(res) ? 400 : 200,
      body: JSON.stringify(res),
      headers: {
        // Required for CORS support to work
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
        // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Credentials': true,
      },
    });
  });
};
