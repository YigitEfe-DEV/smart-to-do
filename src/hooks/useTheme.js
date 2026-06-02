import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, STORAGE_KEYS, THEMES } from '../constants/app.js';
import { readString, writeString } from '../utils/storage.js';

function resolveInitialTheme() {
  const stored = readString(STORAGE_KEYS.theme, DEFAULT_THEME);
  return Object.values(THEMES).includes(stored) ? stored : DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setTheme] = useState(resolveInitialTheme);

  useEffect(() => {
    writeString(STORAGE_KEYS.theme, theme);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === THEMES.dark ? THEMES.light : THEMES.dark));
  }, []);

  const setSpecificTheme = useCallback((value) => {
    if (Object.values(THEMES).includes(value)) {
      setTheme(value);
    }
  }, []);

  return { theme, setTheme: setSpecificTheme, toggleTheme };
}
