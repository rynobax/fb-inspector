import React, { createContext, useContext, useEffect, useRef } from 'react';
import { navigate } from '@reach/router';

import { useSettings } from './settings';
import { resetData, resetOpen } from 'stores/firebase';

export interface Project {
  id: string;
  name: string;
  ownerUserId: string;
  hidden: boolean;
}

interface ProjectContextType {
  project: Project | null;
  projects: Project[];
  selectProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  projects: [],
  selectProject: () => {
    throw Error('selectProject not initalized!');
  },
});

interface ProjectProviderProps {
  selectedProjectId: string | undefined;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = props => {
  const { settings } = useSettings();

  const project =
    settings.projects.find(p => p.id === props.selectedProjectId) || null;

  const projectId = project ? project.id : null;
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
        selectProject: id => navigate(`/project/${id}`),
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  return useContext(ProjectContext);
};
