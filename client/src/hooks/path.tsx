import React, { createContext, useContext, useState, useEffect } from 'react';
import { observe } from 'mobx';
import { navigate } from '@reach/router';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';

import { openStore, dataStore } from 'stores/store';

interface PathContextType {
  path: string[];
  pathStr: string;
  setPath: (path: string[]) => void;
}

const PathContext = createContext<PathContextType>({
  path: [],
  pathStr: '/',
  setPath: () => {
    throw Error('PathContext updatePath not initalized!');
  },
});

interface PathProviderProps {
  uri: string | undefined;
}

function noUri(): string[] {
  throw Error('no uri');
}

export const PathProvider: React.FC<PathProviderProps> = props => {
  const full = props.uri ? props.uri.split('/') : noUri();
  const dataNdx = full.indexOf('data');
  const path = dataNdx === -1 ? [] : full.slice(dataNdx + 1).filter(e => !!e);
  const setPath = (newPath: string[]) => {
    const [project] = full.slice(2, 3);
    navigate(`/project/${project}/data/${newPath.join('/')}`);
  };

  const pathStr = pathToString(path);

  return (
    <PathContext.Provider value={{ path, setPath, pathStr }}>
      {props.children}
    </PathContext.Provider>
  );
};

export function pathToString(path: string[]) {
  return path.length === 0 ? '/' : `/${path.join('/')}`;
}

export const usePath = () => {
  const { path, setPath, pathStr } = useContext(PathContext);
  return { path, pathStr, setPath };
};

export const useIsPathOpen = (path: string[], initialVal: boolean) => {
  const pathStr = pathToString(path);

  const [open, setOpen] = useState(() => {
    const cached = openStore.get(pathStr);
    return cached === undefined ? initialVal : cached;
  });

  useEffect(() => {
    const initial = openStore.get(pathStr);
    if (!initial) openStore.set(pathStr, initialVal);
    return observe(openStore, pathStr, change => setOpen(!!change.newValue));
  }, [pathStr, initialVal]);

  const toggle = () => {
    openStore.set(pathStr, !open);
  };

  return { open, toggle };
};

let i = 0;

const LOOP_LIMIT = 100000;

function getChildrenPath(initialPath: string[]): string[][] {
  const timeKey = 'getChildrenPath' + String(i++);
  console.time(timeKey);

  const res: string[][] = [];
  const queue = [initialPath];

  let count = 0;
  while (true) {
    const path = queue.shift();
    if (count++ > LOOP_LIMIT)
      throw Error(`Exceeded path limit of ${LOOP_LIMIT}`);
    if (!path) break;

    // Everything on the queue should make it into the result
    res.push(path);

    // In order for this path to be "open", we must have
    // got it's data and it must be an object, and it
    // must be tagged as open
    const pathStr = pathToString(path);
    const data = dataStore.get(pathStr);
    if (!data) continue;
    const { value } = data;
    if (typeof value !== 'object' || !value) continue;
    const isOpen = openStore.get(pathStr);
    if (!isOpen) continue;

    // If it's open, push it's children on to the queue
    queue.push(...Object.keys(value).map(k => path.concat(k)));
  }

  console.timeEnd(timeKey);
  // keys.sort((a, b) => a.localeCompare(b));
  console.log(res)
  return res;

  // const initialData = dataStore.get(pathStr);
  // if (!initialData) return [initialPath];

  // const { value } = initialData;
  // if (typeof value !== 'object' || !value) return [initialPath];

  // const isOpen = openStore.get(pathStr);
  // if (!isOpen) return [initialPath];

  // const keys = Object.keys(value);
  // keys.sort((a, b) => a.localeCompare(b));

  // const result = keys.reduce(
  //   (acc, k) => {
  //     const newPath = [...initialPath, k];
  //     return [...acc, ...getChildrenPath(newPath)];
  //   },
  //   [initialPath]
  // );

  // return result;
}

export const usePathArr = () => {
  const { path } = usePath();
  const [childrenPath, setChildrenPath] = useState(() => {
    return getChildrenPath(path);
  });
  useEffect(() => {
    const updatePath = throttle(() => {
      const newPath = getChildrenPath(path);
      // Prevent needless rerenders
      if (!isEqual(childrenPath, newPath)) {
        setChildrenPath(newPath);
      }
    }, 250);
    updatePath();
    const openCleanup = openStore.observe(() => {
      updatePath();
    });

    const dataCleanup = dataStore.observe(() => {
      updatePath();
    });

    return () => {
      openCleanup();
      dataCleanup();
    };
  }, [path, childrenPath]);
  return childrenPath;
};
