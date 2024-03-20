import { useEffect, useState } from 'react';

import { MOBILE_SIZE, TABLET_SIZE } from 'constants/common';

const isClient = typeof window === 'object';

function getSize() {
  return {
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  };
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize());
    }

    if (isClient) {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    return undefined;
  }, []);

  return windowSize;
}

export function useMobile() {
  const { width } = useWindowSize();
  return width < MOBILE_SIZE;
}

export function useTablet() {
  const { width } = useWindowSize();
  return width < TABLET_SIZE;
}
