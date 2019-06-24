import { createContext, useContext } from 'react';

export interface Project {
  // Used internally to keep track
  __id: string;
  id: string;
  name: string;
}

interface ProjectContextType {
  project: Project | null;
  projects: Project[];
  selectProject: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

export const ProjectContext = createContext<ProjectContextType>({
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

export const useProject = () => {
  return useContext(ProjectContext);
};
