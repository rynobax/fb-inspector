import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

require('dotenv').config();

const { SECRET } = process.env;
if (!SECRET) throw Error('Secret is missing, check .ENV');
const client_id =
  '561478918972-vkd6611959mpitiq8rvs6484dktic5e6.apps.googleusercontent.com';
const redirect_uri = 'https://6781a2d3.ngrok.io/oauth';

const GRACE_PADDING = 1000 * 30;

function parseb64(s: string) {
  return Buffer.from(s, 'base64').toString();
}

interface ParsedResponse {
  email: string;
  // We don't use uid but it could be useful in the future
  uid: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
}

function parseResponse(res: Credentials): ParsedResponse {
  if (!res.id_token) throw Error('No id token!');
  const middle = res.id_token.split('.')[1];
  const { email, sub: uid } = JSON.parse(parseb64(middle));
  const { expiry_date } = res;
  if (!expiry_date) throw Error('No expiry date!');
  if (!res.refresh_token) throw Error('No access_token!');
  if (!res.access_token) throw Error('No refresh_token!');
  return {
    email,
    uid,
    refresh_token: res.refresh_token,
    access_token: res.access_token,
    expires_at: expiry_date - GRACE_PADDING,
  };
}

interface InitTokenParams {
  code: string;
}

export function initToken({ code }: InitTokenParams) {
  const oauth2Client = new google.auth.OAuth2(client_id, SECRET, redirect_uri);
  return new Promise<ParsedResponse>((resolve, reject) => {
    oauth2Client.getToken(code, (err, res) => {
      if (err) reject(err);
      else if (!res) reject('No response from getToken!');
      else {
        resolve(parseResponse(res));
      }
    });
  });
}

interface GetAccessTokenParams {
  access_token: string;
  refresh_token: string;
}

interface GetAccessTokenResponse {
  access_token: string;
}

export function getAccessToken({
  access_token,
  refresh_token,
}: GetAccessTokenParams) {
  console.log({ access_token, refresh_token });
  const oauth2Client = new google.auth.OAuth2(client_id, SECRET, redirect_uri);
  return new Promise<GetAccessTokenResponse>((resolve, reject) => {
    oauth2Client.setCredentials({ access_token, refresh_token });
    oauth2Client.getAccessToken((err, res, req) => {
      console.log(req);
      if (err) reject(err);
      else if (!res) reject(`Got empty access token`);
      else resolve({ access_token: res });
    });
  });
}
