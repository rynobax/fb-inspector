import React from 'react';
import { RouteComponentProps } from '@reach/router';

type Error404Props = RouteComponentProps;

const Error404: React.FC<Error404Props> = () => {
  return <h1 style={{ textAlign: 'center' }}>404 not found!</h1>;
};

export default Error404;
