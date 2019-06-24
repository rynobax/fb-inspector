import React, { useState, Suspense } from 'react';

import Main from 'pages/Main';
import { PathContext } from 'hooks/path';
import { ProjectContext } from 'hooks/project';
import ErrorBoundary from 'components/ErrorBoundary';
import { useSettings } from 'hooks/settings';

const Setup: React.FC = () => {
  // Path
  const [path, setPath] = useState<string[]>([]);

  // Project
  const [settings, dispatch] = useSettings();

  const project =
    settings.projects.find(p => p.id === settings.selectedProject) || null;

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <PathContext.Provider value={{ path, setPath }}>
            <ProjectContext.Provider
              value={{
                project,
                projects: settings.projects,
                addProject: project => dispatch({ type: 'add', project }),
                selectProject: id => dispatch({ type: 'select', id }),
                updateProject: project => dispatch({ type: 'update', project }),
                removeProject: id => dispatch({ type: 'remove', id }),
              }}
            >
              <Main />
            </ProjectContext.Provider>
          </PathContext.Provider>
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default Setup;
