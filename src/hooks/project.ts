import { createContext, useContext } from 'react';

export interface Project {
  id: string;
  name: string;
}

interface ProjectContextType {
  project: Project | null;
  projects: Project[];
  selectProject: (id: string) => void;
  addProject: (project: Project) => void;
}

export const ProjectContext = createContext<ProjectContextType>({
  project: null,
  projects: [],
  selectProject: () => {
    throw Error('selectProject not initalized!');
  },
  addProject: () => {
    throw Error('addProject not initalized!');
  }
});

export const useProject = () => {
  return useContext(ProjectContext);
};
