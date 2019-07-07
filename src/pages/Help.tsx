import React from 'react';
import { RouteComponentProps } from '@reach/router';

type HelpProps = RouteComponentProps;

const Help: React.FC<HelpProps> = () => {
  return <h2 style={{ textAlign: 'center' }}>This is the help page</h2>;
};

export default Help;
