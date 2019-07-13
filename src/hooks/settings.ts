import { useReducer, useEffect, useState } from 'react';
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

interface ProjectAdd {
  type: 'project-add';
  project: Project;
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
  | ProjectAdd
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

  const state: Settings = JSON.parse(settingsJSON);

  function dispatch(action: SettingsAction) {
    const updatedState = getUpdatedState(state, action);
    setSettingsJSON(JSON.stringify(updatedState));
  }

  const accounts: GoogleAccount[] = state.users.map(u => {
    return {
      id: u.id,
      email: u.email,
      getAccessToken: async () => {
        const { access_token, expires_at, email, id } = u;
        const expired = Date.now() > expires_at;
        console.log({ expired });
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

  // Nicer version of state for ui
  const consumerState = {
    accounts,
    projects: state.projects,
  };

  const actionCreators = {
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
              },
            })
          );
        })
      );
    },
    addUser: (user: Omit<GoogleUser, 'id'>) =>
      dispatch({ type: 'googleuser-add', user }),
    removeUser: (id: string) => dispatch({ type: 'googleuser-remove', id }),
  };

  // useEffect(() => {
  //   console.log(accounts.length)
  //   actionCreators.refreshProjects();
  // }, [accounts.length]);

  return [consumerState, actionCreators] as [typeof consumerState, typeof actionCreators];
};
