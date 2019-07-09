import React from 'react';
import { Router, RouteComponentProps } from '@reach/router';

import Error404 from './Error404';
import Help from './Help';
import OAuthCatcher from './OAuthCatcher';
import { ProjectProvider } from 'hooks/project';
import DBViewer from './DBViewer';

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


const Project: React.FC<RouteComponentProps> = () => {
  return (
    <Router>
      <ProjectRoutes path="/" />
      <ProjectRoutes path=":projectId/*" />
    </Router>
  );
};

const ProjectRoutes: React.FC<
  RouteComponentProps<{ projectId: string }>
> = ({ projectId }) => {
  return (
    <ProjectProvider selectedProjectId={projectId}>
      <Router>
        <DBViewer default />
      </Router>
    </ProjectProvider>
  );
};

export default Routing;
