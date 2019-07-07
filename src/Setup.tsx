import React, { Suspense } from 'react';

import Routing from 'pages/Routing';
import TopLevelErrorBoundary from 'components/TopLevelErrorBoundary';

const Setup: React.FC = () => {
  return (
    <React.StrictMode>
      <TopLevelErrorBoundary>
        <Suspense fallback={<div>Fallback</div>}>
          <Routing />
        </Suspense>
      </TopLevelErrorBoundary>
    </React.StrictMode>
  );
};

export default Setup;
