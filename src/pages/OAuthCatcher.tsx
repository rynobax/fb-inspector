import React, { useEffect, useState } from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import got from 'got';
import { getOAuthRefreshToken } from 'services/oauth';
import { useSettings } from 'hooks/settings';

type OAuthProps = RouteComponentProps;

const OAuthCatcher: React.FC<OAuthProps> = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useSettings()[1];

  if (!props.location) throw Error('No location');

  const { hash } = props.location;
  useEffect(() => {
    const response = hash
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
    const { access_token } = response;
    getOAuthRefreshToken(access_token)
      .then(res => {
        const middle = res.id_token.split('.')[1];
        const email = JSON.parse(btoa(middle)).email;
        const user = { email, refreshToken: res.refresh_token };
        dispatch({ type: 'googleuser-add', user });
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [hash, dispatch]);

  if (loading) return <div>Loading</div>;
  if (error) throw error;

  // We got what we came for, close window
  window.close();
  return null;
};

interface SuccessfulResponse {
  access_token: string;
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
