import { useContext } from 'react';
import got from 'got';
import { observable } from 'mobx';

import { ProjectContext, Project } from './project';

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

type StoreObj = SuccessObj | ErrorObj;

interface SuccessObj {
  value: FirebaseValue;
  error: undefined;
}

interface ErrorObj {
  value: undefined;
  error: Error;
}

export const dataStore = observable.map<string, StoreObj>({});

export const resetStore = () => dataStore.clear();

export const useFirebase = (path: string[]) => {
  const { project } = useContext(ProjectContext);
  if (!project) throw Error('Trying to use firebase with no project selected!');

  const pathStr = path.join('/');
  const val = dataStore.get(pathStr);
  if (!val) {
    // Haven't cached, kick off request
    const prom = new Promise(async (resolve, reject) => {
      try {
        const value = await queryData(project, pathStr);
        dataStore.set(pathStr, { value });
      } catch(error) {
        dataStore.set(pathStr, { value: null, error });
      }
      resolve();
    });
    throw prom;
  } else if(val.error) {
    // Request error
    throw val.error;
  } else {
    // Have the value
    return val.value;
  }
};
