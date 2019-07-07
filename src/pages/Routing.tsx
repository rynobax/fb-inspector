import React from 'react';
import { Router } from '@reach/router';

import DBViewer from './DBViewer';
import Error404 from './Error404';
import Help from './Help';

interface RoutingProps {}

const Routing: React.FC<RoutingProps> = props => {
  return (
    <Router>
      <DBViewer path="data" />
      <Help path="help" />
      <Error404 default />
    </Router>
  );
};

export default Routing;
