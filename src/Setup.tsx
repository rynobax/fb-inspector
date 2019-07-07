import React, { Suspense } from 'react';

import Routing from 'pages/Routing';
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
              <Routing />
            </ProjectProvider>
          </PathProvider>
        </Suspense>
      </TopLevelErrorBoundary>
    </React.StrictMode>
  );
};

export default Setup;
