import React from 'react';
import DBViewer from 'pages/DBViewer';
import { RouteComponentProps } from '@reach/router';
import { ProjectProvider } from 'hooks/project';

type ProjectProps = RouteComponentProps<{ projectId: string }>;

const Project: React.FC<ProjectProps> = ({ projectId }) => {
  return (
    <ProjectProvider selectedProjectId={projectId} >
      <DBViewer path="/" />
      <DBViewer path=":projectId" />
    </ProjectProvider>
  );
};

export default Project;
