import { STORAGE_ERROR_EVENT } from '../constants/app.js';

/**
 * Read a JSON-encoded value from localStorage.
 * Returns the fallback when storage is unavailable or the payload is corrupted.
 */
export function readJSON(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    emitStorageError('read', key, error);
    return fallback;
  }
}

/**
 * Persist a JSON-encoded value to localStorage.
 * Returns true when the write succeeded, false otherwise.
 */
export function writeJSON(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    emitStorageError('write', key, error);
    return false;
  }
}

/**
 * Read a plain string value from localStorage with a fallback default.
 */
export function readString(key, fallback = '') {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    emitStorageError('read', key, error);
    return fallback;
  }
}

/**
 * Persist a plain string value to localStorage.
 */
export function writeString(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    emitStorageError('write', key, error);
    return false;
  }
}

function emitStorageError(op, key, error) {
  if (typeof window === 'undefined') return;
  const detail = { op, key, error };
  window.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT, { detail }));
}
