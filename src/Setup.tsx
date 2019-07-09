import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import Routing from 'pages/Routing';
import TopLevelErrorBoundary from 'components/TopLevelErrorBoundary';
import { theme } from 'sc';

const Setup: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <TopLevelErrorBoundary>
          <Suspense fallback={<div>Fallback</div>}>
            <Routing />
          </Suspense>
        </TopLevelErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default Setup;
