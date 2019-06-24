import got from 'got';
import { unstable_createResource, Resource } from 'react-cache';

import { ProjectContext, Project } from './project';
import { useContext } from 'react';

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

const resources: {
  [id: string]: Resource<string, FirebaseValue>;
} = {};

function getOrCreateResource(project: Project) {
  if (!resources[project.__id]) {
    resources[project.__id] = createFirebaseResource(project);
  }
  return resources[project.__id];
}

export const createFirebaseResource = (project: Project) =>
  unstable_createResource<string, FirebaseValue>(async path => {
    const data = await queryData(project, path);
    return data;
  });

export const useFirebase = (path: string[]) => {
  const { project } = useContext(ProjectContext);
  if (!project) throw Error('Trying to use firebase with no project selected!');
  const resource = getOrCreateResource(project);
  const data = resource.read(path.join('/'));
  return data;
};
