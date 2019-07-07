import React, { createContext, useContext, useState, useEffect } from 'react';
import { observe } from 'mobx';
import { openState, dataStore } from 'stores/firebase';

interface PathContextType {
  path: string[];
  setPath: (path: string[]) => void;
}

const PathContext = createContext<PathContextType>({
  path: [],
  setPath: () => {
    throw Error('updatePath not initalized!');
  },
});

interface PathProviderProps {
  rootPath: string[];
}

export const PathProvider: React.FC<PathProviderProps> = props => {
  const [path, setPath] = useState<string[]>(props.rootPath);
  return (
    <PathContext.Provider value={{ path, setPath }}>
      {props.children}
    </PathContext.Provider>
  );
};

export function pathToString(path: string[]) {
  return path.length === 0 ? '/' : `/${path.join('/')}`;
}

export const usePath = () => {
  const { path, setPath } = useContext(PathContext);
  const pathStr = pathToString(path);
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
    return openState.observe(() => setChildrenPath(getChildrenPath(path)));
  }, [path]);
  return childrenPath;
};
