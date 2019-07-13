import React, { Suspense, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';

import Routing from 'pages/Routing';
import TopLevelErrorBoundary from 'components/TopLevelErrorBoundary';
import { theme } from 'sc';
import { useSettings, LocalStorageSettingsProvider } from 'hooks/settings';

const Setup: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <TopLevelErrorBoundary>
          <LocalStorageSettingsProvider>
            <Suspense fallback={<div>Fallback</div>}>
              <Routing />
            </Suspense>
            <SettingsRefresher />
          </LocalStorageSettingsProvider>
        </TopLevelErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  );
};

const SettingsRefresher: React.FC = () => {
  const [settings, actions] = useSettings();
  const isFirstRun = useRef(true);

  console.log('refresher', settings);
  const accountCount = settings.accounts.length;
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    console.log('would refresh');
    actions.refreshProjects();
  }, [accountCount]);
  return null;
};

export default Setup;
