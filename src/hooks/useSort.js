import { useCallback, useEffect, useState } from 'react';
import { SORT_OPTIONS, STORAGE_KEYS } from '../constants/app.js';
import { readString, writeString } from '../utils/storage.js';

function resolveInitialSort() {
  const stored = readString(STORAGE_KEYS.sort, SORT_OPTIONS.newest);
  return Object.values(SORT_OPTIONS).includes(stored)
    ? stored
    : SORT_OPTIONS.newest;
}

export function useSort() {
  const [sort, setSort] = useState(resolveInitialSort);

  useEffect(() => {
    writeString(STORAGE_KEYS.sort, sort);
  }, [sort]);

  const cycleSort = useCallback(() => {
    setSort((current) => {
      const order = [
        SORT_OPTIONS.newest,
        SORT_OPTIONS.oldest,
        SORT_OPTIONS.alpha,
      ];
      const next = order[(order.indexOf(current) + 1) % order.length];
      return next;
    });
  }, []);

  return { sort, setSort, cycleSort };
}
