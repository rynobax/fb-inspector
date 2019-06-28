import { createContext, useContext, useState, useEffect } from 'react';
import { observable, observe } from 'mobx';
import { dataStore } from './firebase';

interface PathContextType {
  path: string[];
  setPath: (path: string[]) => void;
}

export const PathContext = createContext<PathContextType>({
  path: [],
  setPath: () => {
    throw Error('updatePath not initalized!');
  },
});

export const usePath = () => {
  const { path, setPath } = useContext(PathContext);
  return { path, setPath };
};

const openState = observable.map<string, boolean>({});

export const useIsPathOpen = (path: string[]) => {
  const pathStr = path.join('/');
  const [open, setOpen] = useState(false);
  const toggle = () => openState.set(pathStr, !open);
  useEffect(() => {
    openState.set(pathStr, false);
    return observe(openState, pathStr, change => setOpen(change.newValue));
  }, [pathStr]);
  return { open, toggle };
};

function getChildrenPath(initialPath: string[]): string[][] {
  const pathStr = initialPath.join('/');
  const initialData = dataStore.get(pathStr);
  if (!initialData) return [initialPath];
  const { value } = initialData;
  if (typeof value !== 'object' || !value) return [initialPath];
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
  return getChildrenPath(path);
};
