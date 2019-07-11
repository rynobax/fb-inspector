import { Dispatch, useState, useEffect } from 'react';

export default function useLocalStorage(
  key: string,
  initialValue: string = ''
): [string, Dispatch<string>] {
  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) || initialValue
  );

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      const newValue = window.localStorage.getItem(key) || initialValue;
      if (value !== newValue) setValue(newValue);
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [initialValue, key, value]);

  return [value, setValue];
}
