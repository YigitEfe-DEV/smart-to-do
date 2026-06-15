import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/app.js';
import { readJSON, writeJSON } from '../utils/storage.js';

function createTask(text) {
  return {
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `t_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    text,
    completed: false,
    createdAt: Date.now(),
  };
}

function sanitizeTaskText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Hydrates tasks from localStorage on first paint and exposes mutation
 * helpers. The `isHydrated` flag lets callers defer UI work that depends
 * on the actual task list until storage has been read.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(() => readJSON(STORAGE_KEYS.tasks, []));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeJSON(STORAGE_KEYS.tasks, tasks);
  }, [tasks, isHydrated]);

  const addTask = useCallback((rawText) => {
    const text = sanitizeTaskText(rawText);
    if (!text) return false;
    setTasks((current) => [createTask(text), ...current]);
    return true;
  }, []);

  const updateTask = useCallback((id, patch) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    );
  }, []);

  const editTaskText = useCallback((id, rawText) => {
    const text = sanitizeTaskText(rawText);
    if (!text) return false;
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, text } : task)),
    );
    return true;
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((current) => current.filter((task) => !task.completed));
  }, []);

  const resetAll = useCallback(() => {
    setTasks([]);
  }, []);

  return {
    tasks,
    isHydrated,
    addTask,
    updateTask,
    editTaskText,
    toggleTask,
    deleteTask,
    clearCompleted,
    resetAll,
  };
}
