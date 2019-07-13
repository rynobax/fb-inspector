import Datastore from 'nedb';
import * as google from './google';

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

const upsert = (updateDoc: Partial<Doc> & { email: string }) =>
  new Promise<Doc>((resolve, reject) => {
    const __id = updateDoc.email;
    const newDoc = { __id, ...updateDoc };
    db.update({ __id }, newDoc, { upsert: true }, err => {
      if (err) reject(err);
      else {
        getDoc({ email: updateDoc.email })
          .then(updatedDoc => {
            if (!updatedDoc) throw Error('Could not find updated doc');
            resolve(updatedDoc);
          })
          .catch(reject);
      }
    });
  });

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
  if (!doc) throw Error(`No doc for ${email}`);
  if (doc.expires_at && Date.now() < doc.expires_at) {
    // Still active, return current token
    return doc;
  } else {
    // Need to refresh, get new token
    const newToken = await google.getAccessToken({
      access_token: doc.access_token,
      refresh_token: doc.refresh_token,
    });
    return upsert({ email, access_token: newToken });
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
