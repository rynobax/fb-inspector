import got from 'got';
import { unstable_createResource, Resource } from 'react-cache';

import { ProjectContext } from './project';
import { useContext } from 'react';

type FirebaseScalar = string | number | boolean;
interface FirebaseObject {
  [key: string]: FirebaseScalar;
}
export type FirebaseValue = null | FirebaseScalar | FirebaseObject;

async function queryData(
  id: string,
  path: string
): Promise<FirebaseValue> {
  const data = await got(`https://${id}.firebaseio.com/${path}.json?shallow=true`);
  return JSON.parse(data.body);
}

const resources: {
  [id: string]: Resource<string, FirebaseValue>;
} = {};

function getOrCreateResource(id: string) {
  if(!resources[id]) {
    resources[id] = createFirebaseResource(id);
  }
  return resources[id];
}

export const createFirebaseResource = (baseUrl: string) =>
  unstable_createResource<string, FirebaseValue>(async path => {
    const data = await queryData(baseUrl, path);
    return data;
  });

export const useFirebase = (path: string[]) => {
  const { project } = useContext(ProjectContext);
  if (!project) throw Error('Trying to use firebase with no project selected!');
  const resource = getOrCreateResource(project.id);
  const data = resource.read(path.join('/'));
  return data;
};
