import React, { useState } from 'react';

import Main from 'pages/Main';
import { PathContext } from 'hooks/path';
import ErrorBoundary from 'components/ErrorBoundary';

const Context: React.FC = () => {
  const [path, setPath] = useState<string[]>([]);
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <React.Suspense fallback={null}>
          <PathContext.Provider value={{ path, setPath }}>
            <Main />
          </PathContext.Provider>
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default Context;
