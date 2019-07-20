import got from 'got';

import * as google from './google';
import { MissingEmailError } from './errors';

const { FB_TOKEN } = process.env;
if (!FB_TOKEN) throw Error('Missing FB_TOKEN enviroment variable');

function esc(str: string) {
  return `__${str}__`;
}

function getIdFromEmail(email: string) {
  return email
    .replace(/\./g, esc('dot'))
    .replace(/\$/g, esc('dollar'))
    .replace(/\[/g, esc('rb'))
    .replace(/\]/g, esc('lb'))
    .replace(/#/g, esc('pound'))
    .replace(/\//g, esc('slash'));
}

interface Doc {
  email: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
}

const baseUrl = 'https://fir-inspector.firebaseio.com';

const auth = `?auth=${FB_TOKEN}`;

const fb = {
  get: async (email: string) => {
    const id = getIdFromEmail(email);
    const res = await got.get(`${baseUrl}/accounts/${id}.json${auth}`);
    return JSON.parse(res.body) as (Doc | null);
  },
  update: async (email: string, doc: Partial<Doc>) => {
    const id = getIdFromEmail(email);
    await got.patch(`${baseUrl}/accounts/${id}/.json${auth}`, {
      body: JSON.stringify(doc),
    });
  },
};

async function insert(doc: Doc) {
  await fb.update(doc.email, doc);
  return doc;
}

interface UpdateAccessTokenParams {
  email: string;
  access_token: string;
  expires_at: number;
}

async function updateAccessToken({
  email,
  access_token,
  expires_at,
}: UpdateAccessTokenParams) {
  await fb.update(email, { access_token, expires_at });
  const doc = await fb.get(email);
  if (!doc) throw Error('Could not find doc after updating access token');
  return doc;
}

interface GetAccessTokenParams {
  email: string;
}

export async function getAccessToken({ email }: GetAccessTokenParams) {
  const doc = await fb.get(email);

  // If we don't have their email and are in this method, we need
  // a new code, so just tell the client to forget this email
  if (!doc) throw new MissingEmailError(`No doc for ${email}`);

  if (doc.expires_at && Date.now() < doc.expires_at) {
    // Still active, return current token
    return doc;
  } else {
    // Need to refresh, get new token
    const { access_token, expires_at } = await google.getAccessToken({
      access_token: doc.access_token,
      refresh_token: doc.refresh_token,
      expiry_date: doc.expires_at,
    });
    return updateAccessToken({ email, access_token, expires_at });
  }
}

interface InitTokenParams {
  code: string;
}

export async function initToken({ code }: InitTokenParams) {
  const {
    access_token,
    refresh_token,
    expires_at,
    email,
  } = await google.initToken({ code });
  return insert({ access_token, refresh_token, expires_at, email });
}
