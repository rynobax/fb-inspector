import { createContext, useContext } from 'react';

interface PathContextType {
  path: string[];
  setPath: (path: string[]) => void;
}

export const PathContext = createContext<PathContextType>({
  path: [],
  setPath: () => {
    throw Error('updatePath not initalized!');
  }
});

export const usePath = () => {
  const { path, setPath } = useContext(PathContext);
  return { path, setPath };
};
