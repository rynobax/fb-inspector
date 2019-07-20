import Datastore from 'nedb';
import * as google from './google';
import { MissingEmailError } from './errors';

const db = new Datastore<Doc>({
  filename: './datastore/data.nedb',
  autoload: true,
});

interface Doc {
  email: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
}

function upsert(doc: Doc) {
  return new Promise<Doc>((resolve, reject) => {
    getDoc({ email: doc.email }).then(oldDoc => {
      if (!oldDoc) {
        db.insert({ __id: doc.email, ...doc }, err => {
          if (err) reject(err);
          else resolve(doc);
        });
      } else {
        db.update({ email: doc.email }, doc, {}, err => {
          if (err) reject(err);
          else resolve(doc);
        });
      }
    });
  });
}

interface UpdateAccessTokenParams {
  email: string;
  access_token: string;
  expires_at: number;
}

function updateAccessToken({
  email,
  access_token,
  expires_at,
}: UpdateAccessTokenParams) {
  return new Promise<Doc>((resolve, reject) => {
    db.update({ email }, { $set: { access_token, expires_at } }, {}, err => {
      if (err) reject(err);
      else {
        getDoc({ email })
          .then(doc => {
            if (!doc)
              throw Error('Could not find doc after updating access token');
            resolve(doc);
          })
          .catch(reject);
      }
    });
  });
}

interface GetDocParams {
  email: string;
}

const getDoc = ({ email }: GetDocParams) =>
  new Promise<Doc | null>((resolve, reject) => {
    db.findOne({ __id: email }, (err, doc: Doc | null) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });

interface GetAccessTokenParams {
  email: string;
}

export async function getAccessToken({ email }: GetAccessTokenParams) {
  const doc = await getDoc({ email });
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
  return upsert({ access_token, refresh_token, expires_at, email });
}
