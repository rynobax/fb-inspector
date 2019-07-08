import { useReducer } from 'react';
import produce from 'immer';

import useLocalStorage from './localstore';
import { Project } from './project';
import { GoogleUser } from './oauth';

interface Settings {
  projects: Project[];
  users: GoogleUser[];
}

const initalSettings: Settings = {
  projects: [],
  users: [],
};

interface ProjectAdd {
  type: 'project-add';
  project: Omit<Project, '__id'>;
}

interface ProjectRemove {
  type: 'project-remove';
  id: string;
}

interface ProjectUpdate {
  type: 'project-update';
  project: Project;
}

interface GoogleUserAdd {
  type: 'googleuser-add';
  user: GoogleUser;
}

type SettingsAction =
  | ProjectAdd
  | ProjectRemove
  | ProjectUpdate
  | GoogleUserAdd;

function getUpdatedState(state: Settings, action: SettingsAction) {
  switch (action.type) {
    case 'project-add':
      return produce(state, s => {
        s.projects.push({
          ...action.project,
          __id: getIdFromProject(action.project),
        });
      });
    case 'project-remove':
      return produce(state, s => {
        s.projects = s.projects.filter(p => p.__id === action.id);
      });
    case 'project-update':
      return produce(state, s => {
        s.projects = s.projects.map(p =>
          p.__id === action.project.__id
            ? { ...action.project, __id: getIdFromProject(action.project) }
            : p
        );
      });
  }
  return state;
}

function getIdFromProject(project: Omit<Project, '__id'>) {
  return project.name.toLowerCase();
}

export const useSettings = () => {
  const [settingsJSON, setSettingsJSON] = useLocalStorage(
    'settings',
    JSON.stringify(initalSettings)
  );

  const initialState: Settings = JSON.parse(settingsJSON);

  return useReducer((state: Settings, action: SettingsAction) => {
    const updatedState = getUpdatedState(state, action);
    setSettingsJSON(JSON.stringify(updatedState));
    return updatedState;
  }, initialState);
};
