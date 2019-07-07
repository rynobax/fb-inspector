import React, { createContext, useContext, useEffect, useRef } from 'react';
import { navigate } from '@reach/router';

import { useSettings } from './settings';
import { resetData, resetOpen } from 'stores/firebase';

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
  addProject: (project: Omit<Project, '__id'>) => void;
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

interface ProjectProviderProps {
  selectedProjectId: string | undefined;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = props => {
  const [settings, dispatch] = useSettings();

  const project =
    settings.projects.find(p => p.__id === props.selectedProjectId) || null;

  const projectId = project ? project.__id : null;
  const firstUpdate = useRef(true);
  useEffect(() => {
    // Don't run on first render
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    // Reset stores when project changes
    resetData();
    resetOpen();
  }, [projectId]);

  useEffect(() => {
    document.title = project ? `${project.name}` : 'fb-inspector';
  }, [project]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        projects: settings.projects,
        addProject: project => dispatch({ type: 'add', project }),
        selectProject: id => navigate(`/project/${id}`),
        updateProject: project => dispatch({ type: 'update', project }),
        removeProject: id => dispatch({ type: 'remove', id }),
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  return useContext(ProjectContext);
};
