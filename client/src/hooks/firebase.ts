import { useEffect } from 'react';
import ky from 'ky';

import { useProject } from './project';
import { pathToString } from './path';
import { dataStore, FirebaseValue, Status } from 'stores/firebase';
import { useSettings, GoogleAccount } from './settings';

function params(obj: { [k: string]: string | boolean }) {
  let str = '';
  const keys = Object.keys(obj);
  if (keys.length === 0) return str;
  str += '?';
  str += keys
    .filter(k => obj[k] !== '')
    .map(k => `${k}=${obj[k]}`)
    .join('&');
  return str;
}

interface RequestParams {
  projectId: string;
  account: GoogleAccount;
  pathStr: string;
}

async function queryData({
  account,
  pathStr,
  projectId,
}: RequestParams): Promise<FirebaseValue> {
  const access_token = await account.getAccessToken();
  const data = await ky(
    `https://${projectId}.firebaseio.com/${pathStr}.json${params({
      shallow: true,
      access_token,
    })}`
  );
  return data.json();
}

// const wait = (ms: number) => new Promise(r => setTimeout(() => r(), ms));

function initiateRequest({ account, pathStr, projectId }: RequestParams) {
  const val = dataStore.get(pathStr);
  if (!val) {
    // Haven't cached, kick off request
    const prom = new Promise<void>(async (resolve, reject) => {
      try {
        const value = await queryData({
          account,
          projectId,
          pathStr,
        });
        // Test SuspenseList stuff
        // if (pathStr.startsWith('/its/nested/')) {
        //   await wait(Math.random() * 1000 * 5);
        // }
        dataStore.set(pathStr, {
          status: Status.SUCCESS,
          value,
          error: null,
          prom,
        });
      } catch (error) {
        dataStore.set(pathStr, {
          status: Status.ERROR,
          value: null,
          error,
          prom,
        });
      }
      resolve();
    });
    dataStore.set(pathStr, {
      status: Status.PENDING,
      value: null,
      error: null,
      prom,
    });
    return prom;
  } else {
    return val.prom;
  }
}

const useInfoForQuery = () => {
  const { project } = useProject();
  const { settings } = useSettings();
  if (!project) throw Error('Trying to use firebase with no project selected!');
  const account = settings.accounts.find(u => u.id === project.ownerUserId);
  if (!account)
    throw Error('Trying to use firebase with no user for this project!');
  return { account, project };
};

export const useFirebase = (path: string[]): FirebaseValue => {
  const { account, project } = useInfoForQuery();

  const pathStr = pathToString(path);
  const val = dataStore.get(pathStr);
  if (!val) {
    // Haven't cached, kick off request
    const prom = initiateRequest({
      account,
      pathStr,
      projectId: project.id,
    });
    throw prom;
  } else {
    switch (val.status) {
      case Status.PENDING:
        throw val.prom;
      case Status.SUCCESS:
        return val.value;
      case Status.ERROR:
        throw val.error;
      default:
        // Impossible
        throw Error();
    }
  }
};

export const usePrimeFirebase = (path: string[]) => {
  const { account, project } = useInfoForQuery();
  const pathStr = pathToString(path);
  useEffect(() => {
    initiateRequest({
      account,
      pathStr,
      projectId: project.id,
    });
  }, [project, pathStr, account]);
};
