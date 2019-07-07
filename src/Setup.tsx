import React, { Suspense } from 'react';

import Main from 'pages/DBViewer';
import { PathProvider } from 'hooks/path';
import { ProjectProvider } from 'hooks/project';
import TopLevelErrorBoundary from 'components/TopLevelErrorBoundary';

const Setup: React.FC = () => {
  return (
    <React.StrictMode>
      <TopLevelErrorBoundary>
        <Suspense fallback={<div>Fallback</div>}>
          <PathProvider>
            <ProjectProvider>
              <Main />
            </ProjectProvider>
          </PathProvider>
        </Suspense>
      </TopLevelErrorBoundary>
    </React.StrictMode>
  );
};

export default Setup;
