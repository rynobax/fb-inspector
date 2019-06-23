import { useState, useEffect } from 'react';
import got from 'got';
import { observable, reaction } from 'mobx';

type FirebaseScalar = string | number | boolean;
interface FirebaseObject {
  [key: string]: FirebaseScalar;
}
type FirebaseValue = null | FirebaseScalar | FirebaseObject;

const BASE_URL = 'https://fb-inspector-test.firebaseio.com/';

async function getData(path: string): Promise<FirebaseValue> {
  const data = await got(`${BASE_URL}${path}.json?shallow=true`);
  return JSON.parse(data.body);
}

interface Store {
  [path: string]: {
    loading: boolean;
    data: FirebaseValue;
  } | null;
}

class FirebaseStore {
  @observable store: Store = {};
}

const store = new FirebaseStore();

export const useFirebase = (path: string[]) => {
  const pathKey = path.join('/');
  const initial = store.store[pathKey];

  const [loading, setLoading] = useState(initial ? initial.loading : true);
  const [data, setData] = useState(initial ? initial.data : null);

  useEffect(() => {
    const dispose = reaction(
      () => store.store[pathKey],
      updated => {
        if (updated) {
          setLoading(updated.loading);
          setData(updated.data);
        }
      }
    );
    return dispose;
  }, [pathKey]);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    getData(pathKey).then(newData => {
      if (!cancelled) {
        setData(newData);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [initial, pathKey]);

  return { data, loading };
};
