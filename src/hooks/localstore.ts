import { Dispatch, useState, useEffect, useRef } from 'react';

export default function useLocalStorage(
  key: string,
  initialValue: string = '',
  pollMs?: number
): [string, Dispatch<string>] {
  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) || initialValue
  );

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  // Check at pollMs interval if it's changed
  useInterval(() => {
    const newValue = window.localStorage.getItem(key) || initialValue;
    if (value !== newValue) setValue(newValue);
  }, pollMs || 1000 * 60 * 60);

  return [value, setValue];
}

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
