import React from 'react';
import DBViewer from 'pages/DBViewer';
import { RouteComponentProps } from '@reach/router';

type ProjectProps = RouteComponentProps<{ projectId: string}>;

const Project: React.FC<ProjectProps> = ({ projectId }) => {
  return (
    <>
      <DBViewer path="/" />
      <DBViewer path=":projectId" />
    </>
  );
};

export default Project;
