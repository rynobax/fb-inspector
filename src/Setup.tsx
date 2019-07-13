import React, { Suspense, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';

import Routing from 'pages/Routing';
import TopLevelErrorBoundary from 'components/TopLevelErrorBoundary';
import { theme } from 'sc';
import { useSettings, SettingsContextProvider } from 'hooks/settings';

const Setup: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <TopLevelErrorBoundary>
          <SettingsContextProvider>
            <Suspense fallback={<div>Fallback</div>}>
              <Routing />
            </Suspense>
            <SettingsRefresher />
          </SettingsContextProvider>
        </TopLevelErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  );
};

const SettingsRefresher: React.FC = () => {
  const { settings, actions } = useSettings();
  const isFirstRun = useRef(true);

  const accountCount = settings.accounts.length;
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    actions.refreshProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountCount]);
  return null;
};

export default Setup;
