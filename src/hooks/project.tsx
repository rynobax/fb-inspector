import React, { createContext, useContext, useEffect } from 'react';
import { useSettings } from './settings';

export interface Project {
  // Used internally to keep track
  __id: string;
  id: string;
  name: string;
  legacyToken: string;
}

interface ProjectContextType {
  project: Project | null;
  projects: Project[];
  selectProject: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  projects: [],
  selectProject: () => {
    throw Error('selectProject not initalized!');
  },
  addProject: () => {
    throw Error('addProject not initalized!');
  },
  updateProject: () => {
    throw Error('updateProject not initalized!');
  },
  removeProject: () => {
    throw Error('removeProject not initalized!');
  },
});

export const ProjectProvider: React.FC = ({ children }) => {
  const [settings, dispatch] = useSettings();

  const project =
    settings.projects.find(p => p.id === settings.selectedProject) || null;

  useEffect(() => {
    document.title = project ? `${project.name}` : 'fb-inspector';
  }, [project]);

  return (
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
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  return useContext(ProjectContext);
};
