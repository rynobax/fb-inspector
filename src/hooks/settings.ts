import { useReducer, useEffect } from 'react';
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
  user: Omit<GoogleUser, '__id'>;
}

interface Set {
  type: 'set';
  settings: Settings;
}

type SettingsAction =
  | Set
  | ProjectAdd
  | ProjectRemove
  | ProjectUpdate
  | GoogleUserAdd;

function getUpdatedState(state: Settings, action: SettingsAction) {
  console.log(action);
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
    case 'googleuser-add':
      return produce(state, s => {
        const __id = getIdFromGoogleUser(action.user);
        const user = {
          ...action.user,
          __id,
        };
        if (s.users.find(e => e.__id === __id)) {
          s.users = s.users.map(e => (e.__id === __id ? user : e));
        } else {
          s.users.push(user);
        }
      });
    case 'set':
      return action.settings;
    default:
      throw Error(`Unimplemented action: ${(action as SettingsAction).type}`);
  }
}

function getIdFromGoogleUser(user: Omit<GoogleUser, '__id'>) {
  return user.email.toLowerCase();
}

function getIdFromProject(project: Omit<Project, '__id'>) {
  return project.name.toLowerCase();
}

export const useSettings = (pollMs?: number) => {
  const [settingsJSON, setSettingsJSON] = useLocalStorage(
    'settings',
    JSON.stringify(initalSettings),
    pollMs
  );

  const lsSettings: Settings = JSON.parse(settingsJSON);

  const [state, dispatch] = useReducer((state: Settings, action: SettingsAction) => {
    const updatedState = getUpdatedState(state, action);
    setSettingsJSON(JSON.stringify(updatedState));
    return updatedState;
  }, lsSettings);

  // When adding a user, this will be updated from another window
  // So we need to manually set the reducer state
  // It feels like this is inviting a race condition, but
  // let's see what happens :)
  const stateStr = JSON.stringify(state);
  useEffect(() => {
    if(stateStr !== settingsJSON) {
      dispatch({ type: 'set', settings: JSON.parse(settingsJSON) })
    }
  }, [stateStr, settingsJSON])

  return [state, dispatch] as [Settings, React.Dispatch<SettingsAction>];
};
