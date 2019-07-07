import React from 'react';
import { Router } from '@reach/router';

import Error404 from './Error404';
import Help from './Help';
import Project from 'components/Project';

const Routing: React.FC = () => {
  return (
    <Router>
      <Project path="project/*" />
      <Help path="help" />
      <Error404 default />
    </Router>
  );
};

export default Routing;
