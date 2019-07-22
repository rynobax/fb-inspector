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

function stringToPath(path: string) {
  return path === '/' ? [] : path.split('/').slice(1);
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

const LOOP_LIMIT = 100000;

const A_FIRST = 1;
const B_FIRST = -1;
const EQL = 0;

// https://firebase.google.com/docs/database/usage/limits
const MAX_KEY_LEN = 768;

function lexCompare(a: string, b: string) {
  for (let i = 0; i <= MAX_KEY_LEN; i++) {
    let aCode = a.charCodeAt(i);
    let bCode = b.charCodeAt(i);

    if (isNaN(aCode)) return B_FIRST;
    if (isNaN(bCode)) return A_FIRST;

    if (aCode !== bCode) {
      return aCode > bCode ? A_FIRST : B_FIRST;
    }
  }
  return EQL;
}

function getChildrenPath(initialPath: string[]): string[][] {
  const resStrings: string[] = [];
  const queue = [pathToString(initialPath)];

  let count = 0;
  while (true) {
    const pathStr = queue.shift();
    if (count++ > LOOP_LIMIT)
      throw Error(`Exceeded path limit of ${LOOP_LIMIT}`);
    if (!pathStr) break;

    // Everything on the queue should make it into the result
    resStrings.push(pathStr);

    // In order for this path to be "open", we must have
    // got it's data and it must be an object, and it
    // must be tagged as open
    const data = dataStore.get(pathStr);
    if (!data) continue;
    const { value } = data;
    if (typeof value !== 'object' || !value) continue;
    const isOpen = openStore.get(pathStr);
    if (!isOpen) continue;

    const prefix = pathStr === '/' ? '' : '/';
    // If it's open, push it's children on to the queue
    queue.push(...Object.keys(value).map(k => pathStr + prefix + k));
  }

  resStrings.sort(lexCompare);
  const resPaths = resStrings.map(stringToPath);
  return resPaths;
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
