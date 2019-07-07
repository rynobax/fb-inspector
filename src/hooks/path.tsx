import React, { createContext, useContext, useState, useEffect } from 'react';
import { observe } from 'mobx';
import { navigate } from '@reach/router';

import { openState, dataStore, resetOpen } from 'stores/firebase';

interface PathContextType {
  path: string[];
  pathStr: string;
  setPath: (path: string[]) => void;
}

const PathContext = createContext<PathContextType>({
  path: [],
  pathStr: '/',
  setPath: () => {
    throw Error('updatePath not initalized!');
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

export const useIsPathOpen = (path: string[]) => {
  const pathStr = pathToString(path);
  const [open, setOpen] = useState(() => !!openState.get(pathStr));
  const toggle = () => {
    openState.set(pathStr, !open);
  };
  useEffect(() => {
    const initial = openState.get(pathStr);
    if (!initial) openState.set(pathStr, false);
    return observe(openState, pathStr, change => setOpen(!!change.newValue));
  }, [pathStr]);
  return { open, toggle };
};

function getChildrenPath(initialPath: string[]): string[][] {
  const pathStr = pathToString(initialPath);

  const initialData = dataStore.get(pathStr);
  if (!initialData) return [initialPath];

  const { value } = initialData;
  if (typeof value !== 'object' || !value) return [initialPath];

  const isOpen = openState.get(pathStr);
  if (!isOpen) return [initialPath];

  return Object.keys(value).reduce(
    (acc, k) => {
      const newPath = [...initialPath, k];
      return [...acc, ...getChildrenPath(newPath)];
    },
    [initialPath]
  );
}

export const usePathArr = () => {
  const { path } = usePath();
  const [childrenPath, setChildrenPath] = useState(() => getChildrenPath(path));
  useEffect(() => {
    const updatePath = () => setChildrenPath(getChildrenPath(path));
    updatePath();
    return openState.observe(() => {
      updatePath();
    });
  }, [path]);
  return childrenPath;
};
