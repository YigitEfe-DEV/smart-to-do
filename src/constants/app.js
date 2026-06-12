/**
 * Centralized constants for the LumaFlow workspace.
 * Keeping these in one place makes them easy to tweak and audit.
 */

export const APP_NAME = 'LumaFlow';
export const APP_VERSION = '1.2.0';

export const STORAGE_KEYS = Object.freeze({
  tasks: 'task-manager-tasks',
  theme: 'task-manager-theme',
  sort: 'task-manager-sort',
});

export const THEMES = Object.freeze({
  dark: 'dark',
  light: 'light',
});

export const DEFAULT_THEME = THEMES.dark;

export const FILTERS = Object.freeze({
  all: 'all',
  active: 'active',
  completed: 'completed',
});

export const FILTER_TABS = Object.freeze([
  { value: FILTERS.all, label: 'All' },
  { value: FILTERS.active, label: 'Active' },
  { value: FILTERS.completed, label: 'Completed' },
]);

export const SORT_OPTIONS = Object.freeze({
  newest: 'newest',
  oldest: 'oldest',
  alpha: 'alpha',
});

export const SORT_LABELS = Object.freeze([
  { value: SORT_OPTIONS.newest, label: 'Newest first' },
  { value: SORT_OPTIONS.oldest, label: 'Oldest first' },
  { value: SORT_OPTIONS.alpha, label: 'A to Z' },
]);

export const LOADING_MIN_DURATION_MS = 450;
export const SEARCH_DEBOUNCE_MS = 180;

export const TASK_LIMITS = Object.freeze({
  minLength: 1,
  maxLength: 200,
});

export const STORAGE_ERROR_EVENT = 'lumaflow:storage-error';
