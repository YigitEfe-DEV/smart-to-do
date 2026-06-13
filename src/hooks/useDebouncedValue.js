import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of the input value. Updates after `delay` ms of
 * stable input, keeping the UI responsive while reducing work.
 */
export function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
