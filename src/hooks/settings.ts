import { useReducer } from 'react';
import { Project } from './project';
import useLocalStorage from './localstore';
import produce from 'immer';
import { resetStore } from './firebase';

interface Settings {
  projects: Project[];
  selectedProject: string | null;
}

const initalSettings: Settings = {
  projects: [],
  selectedProject: null,
};

interface Select {
  type: 'select';
  id: string;
}

interface Add {
  type: 'add';
  project: Project;
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
        s.projects.push(action.project);
        s.selectedProject = action.project.__id;
      });
    case 'remove':
      return produce(state, s => {
        s.projects = s.projects.filter(p => p.__id === action.id);
      });
    case 'update':
      return produce(state, s => {
        s.projects = s.projects.map(p =>
          p.__id === action.project.__id ? action.project : p
        );
      });
    case 'select':
      resetStore();
      return produce(state, s => {
        s.selectedProject = action.id;
      });
  }
  return state;
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
