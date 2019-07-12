import ky from 'ky';

const BASE_URL = 'http://localhost:9001';

interface OAuthSuccess {
  email: string;
  access_token: string;
  expires_at: number;
}

interface OAuthError {
  error: string | {};
}

type OAuthResponse = OAuthSuccess | OAuthError;

function isOauthError(res: OAuthResponse): res is OAuthError {
  return !!(res as OAuthError).error;
}

type OAuthLookupParams = { email: string } | { code: string };

export async function getOAuthAccessToken(params: OAuthLookupParams) {
  const queryParams = Object.entries(params).reduce((_, [k, v]) => {
    return `${k}=${encodeURIComponent(v)}`;
  }, '');
  const url = `${BASE_URL}/access_token?${queryParams}`;
  const res = await ky.post(url);
  const data: OAuthResponse = await res.json();
  if (isOauthError(data)) throw Error(JSON.stringify(data));
  return data;
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

type ProjectsResponse = {
  results: {
    projectId: string;
    projectNumber: string;
    displayName: string;
    name: string;
    resources: {
      hostingSite: string;
      realtimeDatabaseInstance: string;
    };
  }[];
};

export async function getProjects(access_token: string) {
  // https://firebase.googleapis.com/v1beta1/projects
  // key: AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM
  const res: ProjectsResponse = await ky('https://firebase.googleapis.com/v1beta1/projects', {
    headers: { authorization: `Bearer ${access_token}` },
  }).json();
  return res.results;
}
