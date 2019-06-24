import React, { useState, Suspense } from 'react';

import Main from 'pages/Main';
import { PathContext } from 'hooks/path';
import { ProjectContext, Project } from 'hooks/project';
import ErrorBoundary from 'components/ErrorBoundary';

const Setup: React.FC = () => {
  // Path
  const [path, setPath] = useState<string[]>([]);

  // Project
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Cool Project' },
    { id: '2', name: 'Billy Gates' }
  ]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const project = projects.find(p => p.id === selectedProject) || null;

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <PathContext.Provider value={{ path, setPath }}>
            <ProjectContext.Provider
              value={{
                project,
                projects,
                addProject,
                selectProject: setSelectedProject
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
