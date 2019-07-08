import React from 'react';
import { Router } from '@reach/router';

import Error404 from './Error404';
import Help from './Help';
import Project from 'components/Project';
import OAuthCatcher from './OAuthCatcher';

const Routing: React.FC = () => {
  return (
    <Router>
      <Project path="/" />
      <Project path="project/*" />
      <Help path="help" />
      <OAuthCatcher path="oauth" />
      <Error404 default />
    </Router>
  );
};

export default Routing;
