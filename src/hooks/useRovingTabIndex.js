import { useCallback, useRef, useState } from 'react';

/**
 * Implements the WAI-ARIA tablist roving tabindex pattern. The currently
 * focused item is tabbable; siblings respond to arrow keys instead of Tab.
 */
export function useRovingTabIndex(itemCount) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);

  const setRef = useCallback((index) => (node) => {
    if (node) refs.current[index] = node;
    else delete refs.current[index];
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      if (itemCount === 0) return;
      const last = itemCount - 1;
      let next = activeIndex;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = activeIndex === last ? 0 : activeIndex + 1;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = activeIndex === 0 ? last : activeIndex - 1;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = last;
          break;
        default:
          return;
      }
      event.preventDefault();
      setActiveIndex(next);
      const node = refs.current[next];
      if (node && typeof node.focus === 'function') {
        node.focus();
      }
    },
    [activeIndex, itemCount],
  );

  const getTabIndex = useCallback(
    (index) => (index === activeIndex ? 0 : -1),
    [activeIndex],
  );

  return { activeIndex, setActiveIndex, onKeyDown, getTabIndex, setRef };
}
