import { useContext, useEffect } from 'react';
import got from 'got';
import { observable } from 'mobx';

import { ProjectContext, Project } from './project';
import { pathToString } from './path';

type FirebaseScalar = string | number | boolean;
interface FirebaseObject {
  [key: string]: FirebaseScalar;
}
export type FirebaseValue = null | FirebaseScalar | FirebaseObject;

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

async function queryData(
  project: Project,
  path: string
): Promise<FirebaseValue> {
  const { id, legacyToken } = project;
  const data = await got(
    `https://${id}.firebaseio.com/${path}.json${params({
      shallow: true,
      auth: legacyToken,
    })}`
  );
  return JSON.parse(data.body);
}

type StoreObj = PendingObj | SuccessObj | ErrorObj;

enum Status {
  PENDING,
  ERROR,
  SUCCESS,
}

interface PendingObj {
  status: Status.PENDING;
  prom: Promise<void>;
  value: null;
  error: null;
}

interface SuccessObj {
  status: Status.SUCCESS;
  prom: Promise<void>;
  value: FirebaseValue;
  error: null;
}

interface ErrorObj {
  status: Status.ERROR;
  prom: Promise<void>;
  value: null;
  error: Error;
}

export const dataStore = observable.map<string, StoreObj>({});

export const resetStore = () => dataStore.clear();

const wait = (ms: number) => new Promise(r => setTimeout(() => r(), ms));

function initiateRequest(project: Project, pathStr: string) {
  const val = dataStore.get(pathStr);
  if (!val) {
    // Haven't cached, kick off request
    const prom = new Promise<void>(async (resolve, reject) => {
      try {
        const value = await queryData(project, pathStr);
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

export const useFirebase = (path: string[]): FirebaseValue => {
  const { project } = useContext(ProjectContext);
  if (!project) throw Error('Trying to use firebase with no project selected!');

  const pathStr = pathToString(path);
  const val = dataStore.get(pathStr);
  if (!val) {
    // Haven't cached, kick off request
    const prom = initiateRequest(project, pathStr);
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
  const { project } = useContext(ProjectContext);
  if (!project) throw Error('Trying to use firebase with no project selected!');
  const pathStr = pathToString(path);
  useEffect(() => {
    initiateRequest(project, pathStr);
  }, [project, pathStr]);
};
