import { useState, useEffect, useCallback, useLayoutEffect } from 'react';

function getWindowSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  function handleResize() {
    setWindowSize(getWindowSize());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

function getComponentSize(el: HTMLDivElement | null) {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

export function useComponentSize(ref: React.RefObject<HTMLDivElement> | null) {
  const [size, setSize] = useState(getComponentSize(ref ? ref.current : null));

  const handleResize = useCallback(() => {
    if (ref && ref.current) {
      setSize(getComponentSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (ref && !ref.current) {
      return;
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return function() {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref, handleResize]);

  return size;
}
