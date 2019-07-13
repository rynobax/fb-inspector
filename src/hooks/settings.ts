import { useReducer, useEffect } from 'react';
import produce from 'immer';

import useLocalStorage from './localstore';
import { Project } from './project';
import { getOAuthAccessToken, getProjects } from 'services/google';

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

const initalSettings: Settings = {
  projects: [],
  users: [],
};

interface ProjectSet {
  type: 'project-add';
  project: Project;
}

interface GoogleUserAdd {
  type: 'googleuser-add';
  user: Omit<GoogleUser, 'id'>;
}

interface GoogleUserUpdate {
  type: 'googleuser-update';
  user: Partial<GoogleUser> & Pick<GoogleUser, 'id'>;
}

interface Set {
  type: 'set';
  settings: Settings;
}

type SettingsAction = Set | ProjectSet | GoogleUserAdd | GoogleUserUpdate;

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
    case 'set':
      // Used for when we update the settings from another tab
      return action.settings;
    default:
      throw Error(`Unimplemented action: ${(action as SettingsAction).type}`);
  }
}

function getIdFromGoogleUser(user: Omit<GoogleUser, 'id'>) {
  return user.email.toLowerCase();
}

export const useSettings = () => {
  const [settingsJSON, setSettingsJSON] = useLocalStorage(
    'settings',
    JSON.stringify(initalSettings)
  );

  const lsSettings: Settings = JSON.parse(settingsJSON);

  const [rawState, dispatch] = useReducer(
    (state: Settings, action: SettingsAction) => {
      const updatedState = getUpdatedState(state, action);
      setSettingsJSON(JSON.stringify(updatedState));
      return updatedState;
    },
    lsSettings
  );

  // When adding a user, this will be updated from another window
  // So we need to manually set the reducer state
  // It feels like this is inviting a race condition, but
  // let's see what happens :)
  const stateStr = JSON.stringify(rawState);
  useEffect(() => {
    if (stateStr !== settingsJSON) {
      dispatch({ type: 'set', settings: JSON.parse(settingsJSON) });
    }
  }, [stateStr, settingsJSON]);

  const accounts: GoogleAccount[] = rawState.users.map(u => {
    return {
      id: u.id,
      email: u.email,
      getAccessToken: async () => {
        const { access_token, expires_at, email, id } = u;
        const expired = Date.now() > expires_at;
        if (expired) {
          // Refresh token if expired
          const res = await getOAuthAccessToken({ email });
          dispatch({ type: 'googleuser-update', user: { id, ...res } });
          return res.access_token;
        } else {
          return access_token;
        }
      },
    };
  });

  const state = {
    accounts,
    projects: rawState.projects,
  };

  // Mb need to memo these
  const actionCreators = {
    refreshProjects: async () => {
      await Promise.all(
        state.accounts.map(async account => {
          const token = await account.getAccessToken();
          const projects = await getProjects(token);
          projects.forEach(project =>
            dispatch({
              type: 'project-add',
              project: {
                id: project.projectId,
                name: project.displayName,
                ownerUserId: account.id,
              },
            })
          );
        })
      );
    },
    addUser: (user: Omit<GoogleUser, 'id'>) =>
      dispatch({ type: 'googleuser-add', user }),
  };

  return [state, actionCreators] as [typeof state, typeof actionCreators];
};
