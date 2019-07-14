import React, { useEffect, useReducer, createContext, useContext } from 'react';
import produce from 'immer';

import { Project } from './project';
import { getOAuthAccessToken, getProjects } from 'services/google';

const initalSettings: Settings = {
  projects: [],
  users: [],
};

// How we store in localstorage
interface GoogleUser {
  id: string;
  email: string;
  access_token: string;
  expires_at: number;
}

// What the UI wants
export interface GoogleAccount {
  id: string;
  email: string;
  getAccessToken: () => Promise<string>;
}

interface Settings {
  projects: Project[];
  users: GoogleUser[];
}

interface SettingsSet {
  type: 'settings-set';
  settings: Settings;
}

interface ProjectAdd {
  type: 'project-add';
  project: Project;
}

interface ProjectHide {
  type: 'project-hide';
  id: string;
}

interface ProjectShow {
  type: 'project-show';
  id: string;
}

interface GoogleUserAdd {
  type: 'googleuser-add';
  user: Omit<GoogleUser, 'id'>;
}

interface GoogleUserRemove {
  type: 'googleuser-remove';
  id: string;
}

interface GoogleUserUpdate {
  type: 'googleuser-update';
  user: Partial<GoogleUser> & Pick<GoogleUser, 'id'>;
}

type SettingsAction =
  | SettingsSet
  | ProjectAdd
  | ProjectShow
  | ProjectHide
  | GoogleUserAdd
  | GoogleUserUpdate
  | GoogleUserRemove;

function getUpdatedState(state: Settings, action: SettingsAction) {
  switch (action.type) {
    case 'project-add':
      return produce(state, s => {
        const { project } = action;
        const ndx = s.projects.findIndex(p => p.id === project.id);
        if (ndx === -1) {
          // It's new!
          s.projects.push(project);
        } else {
          // Update it
          s.projects[ndx] = project;
        }
      });
    case 'project-hide':
      return produce(state, s => {
        const project = s.projects.find(s => s.id === action.id);
        if (project) project.hidden = true;
      });
    case 'project-show':
      return produce(state, s => {
        const project = s.projects.find(s => s.id === action.id);
        if (project) project.hidden = false;
      });
    case 'googleuser-add':
      return produce(state, s => {
        const id = getIdFromGoogleUser(action.user);
        const user = {
          ...action.user,
          id,
        };
        if (s.users.find(e => e.id === id)) {
          s.users = s.users.map(e => (e.id === id ? user : e));
        } else {
          s.users.push(user);
        }
      });
    case 'googleuser-update':
      return produce(state, s => {
        s.users = s.users.map(u =>
          u.id === action.user.id
            ? {
                ...u,
                ...action.user,
              }
            : u
        );
      });
    case 'googleuser-remove':
      const deletedId = action.id;
      return produce(state, s => {
        // Remove user
        s.users = s.users.filter(u => u.id !== deletedId);
        // Remove projects
        s.projects = s.projects.filter(p => p.ownerUserId !== deletedId);
      });
    case 'settings-set':
      return action.settings;
    default:
      throw Error(`Unimplemented action: ${(action as SettingsAction).type}`);
  }
}

function getIdFromGoogleUser(user: Omit<GoogleUser, 'id'>) {
  return user.email.toLowerCase();
}

interface ConsumerSettings {
  accounts: GoogleAccount[];
  projects: Project[];
}

interface ActionCreators {
  refreshProjects: () => Promise<void>;
  addUser: (
    user: Pick<GoogleUser, 'email' | 'access_token' | 'expires_at'>
  ) => void;
  removeUser: (id: string) => void;
  hideProject: (id: string) => void;
  showProject: (id: string) => void;
}

// Nicer version of state for ui
// Also nicer actions
function getConsumerStuff(
  state: Settings,
  dispatch: React.Dispatch<SettingsAction>
) {
  const accounts: GoogleAccount[] = state.users.map(u => {
    return {
      id: u.id,
      email: u.email,
      getAccessToken: async () => {
        const { access_token, expires_at, email, id } = u;
        const expired = Date.now() > expires_at;
        if (expired) {
          // Refresh token if expired
          const res = await getOAuthAccessToken({ email });
          if (!res) {
            dispatch({ type: 'googleuser-remove', id });
            throw Error(`Reauth for ${email} required, reload page`);
          } else {
            dispatch({ type: 'googleuser-update', user: { id, ...res } });
            return res.access_token;
          }
        } else {
          return access_token;
        }
      },
    };
  });

  const consumerState: ConsumerSettings = {
    accounts,
    projects: state.projects,
  };

  const actionCreators: ActionCreators = {
    refreshProjects: async () => {
      await Promise.all(
        consumerState.accounts.map(async account => {
          const token = await account.getAccessToken();
          const projects = await getProjects(token);
          projects.forEach(project =>
            dispatch({
              type: 'project-add',
              project: {
                id: project.projectId,
                name: project.displayName,
                ownerUserId: account.id,
                hidden: false,
              },
            })
          );
        })
      );
    },
    addUser: user => dispatch({ type: 'googleuser-add', user }),
    removeUser: id => dispatch({ type: 'googleuser-remove', id }),
    hideProject: id => dispatch({ type: 'project-hide', id }),
    showProject: id => dispatch({ type: 'project-show', id }),
  };
  return [consumerState, actionCreators] as [ConsumerSettings, ActionCreators];
}

interface SettingsContextType {
  settings: ConsumerSettings;
  actions: ActionCreators;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {} as any,
  actions: {} as any,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsContextProvider: React.FC = props => {
  const [reducerState, dispatch] = useReducer(
    (state: Settings, action: SettingsAction) => {
      const updatedState = getUpdatedState(state, action);
      setLSSettings(updatedState);
      return updatedState;
    },
    getLSSettings()
  );

  useEffect(() => {
    function onStorage() {
      dispatch({ type: 'settings-set', settings: getLSSettings() });
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const [settings, actions] = getConsumerStuff(reducerState, dispatch);
  return (
    <SettingsContext.Provider value={{ settings, actions }}>
      {props.children}
    </SettingsContext.Provider>
  );
};

const SETTINGS_KEY = 'settings';

function getLSSettings(): Settings {
  return JSON.parse(
    window.localStorage.getItem(SETTINGS_KEY) || JSON.stringify(initalSettings)
  );
}

function setLSSettings(value: Settings) {
  return window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
}
