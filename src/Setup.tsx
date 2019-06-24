import React, { useState, Suspense } from 'react';

import Main from 'pages/Main';
import { PathContext } from 'hooks/path';
import { ProjectContext, Project } from 'hooks/project';
import ErrorBoundary from 'components/ErrorBoundary';
import useLocalStorage from 'hooks/localstore';

const Setup: React.FC = () => {
  // Path
  const [path, setPath] = useState<string[]>([]);

  // Project
  const [projectsJSON, setProjectsJSON] = useLocalStorage('projects', '[]');

  const [projects, setProjects] = useState<Project[]>(() => {
    return JSON.parse(projectsJSON);
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const addProject = (project: Project) => {
    const newProjects = [...projects, project];
    setProjects(newProjects);
    setProjectsJSON(JSON.stringify(newProjects));
  };

  const updateProject = (project: Project) => {
    const newProjects = projects.map(p => {
      if (p.id === project.id) return project;
      else return p;
    });
    setProjects(newProjects);
    setProjectsJSON(JSON.stringify(newProjects));
  };

  const removeProject = (project: string) => {
    const newProjects = projects.filter(p => p.id !== project);
    setSelectedProject(null);
    setProjects(newProjects);
    setProjectsJSON(JSON.stringify(newProjects));
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
                selectProject: setSelectedProject,
                updateProject,
                removeProject,
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
