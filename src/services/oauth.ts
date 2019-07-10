import ky from 'ky';
import { useSettings } from 'hooks/settings';

const BASE_URL = 'http://localhost:9001';

interface OAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export async function getOAuthRefreshToken(access_token: string) {
  const url = `${BASE_URL}/access_token?code=${encodeURIComponent(access_token)}`;
  const res = await ky(url);
  const data = await res.json();
  if (data.error) {
    if (data.error_description) throw Error(data.error_description);
    else throw Error(JSON.stringify(data));
  }
  return data as OAuthResponse;
}

const client_id =
  '561478918972-vkd6611959mpitiq8rvs6484dktic5e6.apps.googleusercontent.com';
const redirect_uri = 'https://3abcdd60.ngrok.io/oauth';
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

export function useRefreshProjects() {
  const [settings, dispatch] = useSettings();
  async function refresh() {
    // TODO: Pagination
    const url = 'https://firebase.googleapis.com/v1beta1/projects';
    const projects = await Promise.all(
      settings.users.map(async user => {
        // Need to exchange refresh token for access token
        const res = await ky(url, { searchParams: { access_token: '' } });
        const body = res.json();
        console.log(body);
      })
    );
  }
  return refresh;
}
