import React from 'react';
import DBViewer from 'pages/DBViewer';
import { RouteComponentProps, Router } from '@reach/router';
import { ProjectProvider } from 'hooks/project';

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

export default Project;
