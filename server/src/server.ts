import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';

import * as db from './db';
import { MissingEmailError } from './errors';

const app = express();
const PORT = 9001;

app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Just a proxy since we can't store secret on client

app.post('/access_token', async (req, res) => {
  try {
    if (req.query.email) {
      console.log('cache');
      let { email }: { email: string } = req.query;
      email = email.toLowerCase();
      const { access_token, expires_at } = await db.getAccessToken({
        email,
      });
      const ret = { access_token, expires_at, email };
      console.log(ret);
      return res.json(ret);
    } else {
      console.log('no cache');
      const { code }: { code: string } = req.query;
      const { access_token, expires_at, email } = await db.initToken({
        code,
      });
      const ret = { access_token, expires_at, email };
      console.log(ret);
      return res.json(ret);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    if (error instanceof MissingEmailError) {
      return res.json({ action: 'email-not-exist' });
    }
    res.status(400);
    if (error.response) {
      return res.json({ error: error.response.data });
    } else {
      return res.json({ error: error.toString() });
    }
  }
});

export function start() {
  app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
}
