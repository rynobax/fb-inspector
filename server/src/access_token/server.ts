import * as Sentry from '@sentry/node';

import * as db from './db';
import { MissingEmailError } from './errors';

interface Query {
  [key: string]: string | undefined;
}

interface SuccessRes {
  access_token: string;
  expires_at: number;
  email: string;
}

interface ErrorRes {
  error: string;
}

interface MissingEmailRes {
  action: 'email-not-exist';
}

type Res = SuccessRes | ErrorRes | MissingEmailRes;

export function isErrorRes(res: Res): res is ErrorRes {
  return !!(res as ErrorRes).error;
}

export async function getAccessToken(query: Query): Promise<Res> {
  try {
    let { email, code } = query;
    if (email) {
      console.log('cache');
      email = email.toLowerCase();
      const { access_token, expires_at } = await db.getAccessToken({
        email,
      });
      const ret = { access_token, expires_at, email };
      console.log(ret);
      return ret;
    } else if (code) {
      console.log('no cache');
      const { access_token, expires_at, email } = await db.initToken({
        code,
      });
      const ret = { access_token, expires_at, email };
      console.log(ret);
      return ret;
    } else {
      throw Error(`Request needs email or code, got: ${JSON.stringify(query)}`);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    if (error instanceof MissingEmailError) {
      return { action: 'email-not-exist' };
    }
    if (error.response) {
      return { error: error.response.data };
    } else {
      return { error: error.message };
    }
  }
}
