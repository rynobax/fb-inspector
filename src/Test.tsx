import React, { Suspense } from 'react';

import TopLevelErrorBoundary from 'components/TopLevelErrorBoundary';

const Main: React.FC = () => {
  return <div>The stuff</div>;
};

const Fallback = () => {
  return <div>Fallback UI</div>;
};

const Test: React.FC = () => {
  return (
    <React.StrictMode>
      <TopLevelErrorBoundary>
        <Suspense fallback={<Fallback />}>
          <Main />
        </Suspense>
      </TopLevelErrorBoundary>
    </React.StrictMode>
  );
};

export default Test;
