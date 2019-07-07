import { useReducer } from 'react';
import produce from 'immer';

import { Project } from './project';
import useLocalStorage from './localstore';

interface Settings {
  projects: Project[];
}

const initalSettings: Settings = {
  projects: [],
};

interface Select {
  type: 'select';
  id: string;
}

interface Add {
  type: 'add';
  project: Omit<Project, '__id'>;
}

interface Remove {
  type: 'remove';
  id: string;
}

interface Update {
  type: 'update';
  project: Project;
}

type SettingsAction = Select | Add | Remove | Update;

function getUpdatedState(state: Settings, action: SettingsAction) {
  switch (action.type) {
    case 'add':
      return produce(state, s => {
        s.projects.push({
          ...action.project,
          __id: getIdFromProject(action.project),
        });
      });
    case 'remove':
      return produce(state, s => {
        s.projects = s.projects.filter(p => p.__id === action.id);
      });
    case 'update':
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
