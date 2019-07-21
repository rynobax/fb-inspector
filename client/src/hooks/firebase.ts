import { useEffect, useState } from 'react';
import ky from 'ky';

import { useProject } from './project';
import { pathToString } from './path';
import { dataStore, FirebaseValue, Status, DataStoreObj } from 'stores/store';
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

function getOrQueryData({
  account,
  pathStr,
  projectId,
}: RequestParams): DataStoreObj {
  const val = dataStore.get(pathStr);
  if (!val) {
    // Haven't cached, kick off request
    const prom = new Promise<DataStoreObj>(async (resolve, reject) => {
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
      const newVal = dataStore.get(pathStr);
      // Should never happen, we unconditionally set above
      if (!newVal) throw Error();
      resolve(newVal);
    });
    dataStore.set(pathStr, {
      status: Status.PENDING,
      value: null,
      error: null,
      prom,
    });
    const newVal = dataStore.get(pathStr);
    // Should never happen, we unconditionally set above
    if (!newVal) throw Error();
    return newVal;
  } else {
    return val;
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

type UseFirebaseResponse =
  | { loading: true; data: undefined }
  | { loading: false; data: FirebaseValue };

export const useFirebase = (path: string[]): UseFirebaseResponse => {
  const { account, project } = useInfoForQuery();
  const pathStr = pathToString(path);
  const [res, setRes] = useState<UseFirebaseResponse>(() => {
    const val = getOrQueryData({
      account,
      pathStr,
      projectId: project.id,
    });
    if (val.status === Status.SUCCESS) {
      return {
        loading: false,
        data: val.value,
      };
    } else {
      return {
        loading: true,
        data: undefined,
      };
    }
  });

  useEffect(() => {
    let cancelled = false;
    const val = getOrQueryData({
      account,
      pathStr,
      projectId: project.id,
    });
    switch (val.status) {
      case Status.PENDING:
        setRes({ loading: true, data: undefined });
        val.prom.then(e => {
          if (!cancelled) setRes({ loading: false, data: e.value });
        });
        break;
      case Status.SUCCESS:
        setRes({ loading: false, data: val.value });
        break;
      case Status.ERROR:
        throw val.error;
      default:
        // Impossible
        throw Error();
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathStr, project.id, account.id]);

  return res;
};

export const usePrimeFirebase = (
  path: string[],
  // When scrolling we want to disable priming
  shouldPrime: boolean
) => {
  const { account, project } = useInfoForQuery();
  const pathStr = pathToString(path);
  useEffect(() => {
    if (shouldPrime)
      getOrQueryData({
        account,
        pathStr,
        projectId: project.id,
      });
  }, [project, pathStr, account, shouldPrime]);
};
