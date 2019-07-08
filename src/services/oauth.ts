import got from 'got';

const BASE_URL = 'https://localhost:9001';

interface OAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export async function getOAuthRefreshToken(access_token: string) {
  const url = `${BASE_URL}/access_token/${access_token}`;
  const { body } = await got(url);
  const data = JSON.parse(body);
  if (data.error) throw Error(data);
  return data as OAuthResponse;
}

const client_id =
  '561478918972-vkd6611959mpitiq8rvs6484dktic5e6.apps.googleusercontent.com';
const redirect_uri = 'https://ec7b8d95.ngrok.io';
// Required for refresh token
const response_type = 'code';
// Required for refresh token
const access_type = 'offline';
// Forces refresh token to be generated every time
const prompt = 'consent';
// All of these are needed for db access
const scopes = [
  'firebase.readonly',
  'firebase.database.readonly',
  'userinfo.email',
];

export async function openOathRegister() {
  const parts = [
    `scope=${scopes
      .map(e => `https://www.googleapis.com/auth/${e}`)
      .join(' ')}`,
    `redirect_uri=${redirect_uri}`,
    `response_type=${response_type}`,
    `client_id=${client_id}`,
    `access_type=${access_type}`,
    `prompt=${prompt}`,
  ];
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${parts.join('&')}`;
  window.open(url, 'oath', 'height=600,width=600');
}
