import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { getOAuthAccessToken } from 'services/google';
import { useSettings } from 'hooks/settings';

type OAuthProps = RouteComponentProps;

const OAuthCatcher: React.FC<OAuthProps> = props => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { settings, actions } = useSettings();

  if (!props.location) throw Error('No location');

  const { hash, search } = props.location;
  useEffect(() => {
    const data = hash || search;
    const response = data
      .slice(1)
      .split('&')
      .reduce<Response>(
        (p, kv) => {
          const [k, v] = kv.split('=');
          return { ...p, [k]: v };
        },
        {} as any
      );
    if (isErrorResponse(response))
      throw Error(`Got response ${response.error}`);
    const { access_token, code } = response;
    const token = access_token || code;
    if (!token) throw Error('No token!');

    if (!loading && !email) {
      setLoading(true);
      getOAuthAccessToken({ code: token })
        .then(res => {
          if (!res) throw Error('Auth failed');
          const { email, access_token, expires_at } = res;
          const user = { email, access_token, expires_at };
          actions.addUser(user);
          setLoading(false);
          setEmail(email);
          // We got what we came for, close window
          window.close();
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    }
  }, [hash, search, actions, loading, email]);

  if (loading) return <div>Loading</div>;
  if (error) throw error;

  const settingsReducerProcessing =
    !email || !settings.accounts.find(e => e.email === email);

  if (settingsReducerProcessing) return <div>Loading</div>;

  // We got what we came for, close window
  window.close();
  return <div>This window should close automatically</div>;
};

interface SuccessfulResponse {
  access_token?: string;
  code?: string;
  expires_in: string;
  scope: string;
  token_type: string;
}

interface ErrorResponse {
  error: string;
}

type Response = SuccessfulResponse | ErrorResponse;

function isErrorResponse(response: Response): response is ErrorResponse {
  return !!(response as ErrorResponse).error;
}

export default OAuthCatcher;
