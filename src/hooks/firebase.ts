import { useEffect } from 'react';
import got from 'got';

import { Project, useProject } from './project';
import { pathToString } from './path';
import { dataStore, FirebaseValue, Status } from 'stores/firebase';

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
      // access_token:
      //   'ya29.Gls_ByWYzDc6RNpqkwYjLdWECnmtlOBaFpmTlfkJowYaZt-cp3jx8B9M7i-TJiNXjFGp_YTXSaZ-JmYijcvmUn-5Hi3LdKRqPe4Cc9acglDCH6E0Cn4bzqm7PuZH',
    })}`
  );
  return JSON.parse(data.body);
}

// const wait = (ms: number) => new Promise(r => setTimeout(() => r(), ms));

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
  const { project } = useProject();
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
  const { project } = useProject();
  if (!project) throw Error('Trying to use firebase with no project selected!');
  const pathStr = pathToString(path);
  useEffect(() => {
    initiateRequest(project, pathStr);
  }, [project, pathStr]);
};
