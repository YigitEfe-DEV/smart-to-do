import { TASK_LIMITS } from '../constants/app.js';

/**
 * Normalize a free-form task description: collapse whitespace and trim.
 */
export function sanitizeTaskText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function isWithinLength(text) {
  return text.length >= TASK_LIMITS.minLength && text.length <= TASK_LIMITS.maxLength;
}

export function validateTaskText(rawValue) {
  const text = sanitizeTaskText(rawValue);
  if (text.length < TASK_LIMITS.minLength) {
    return { valid: false, text, reason: 'empty' };
  }
  if (text.length > TASK_LIMITS.maxLength) {
    return { valid: false, text, reason: 'too-long' };
  }
  return { valid: true, text, reason: null };
}

/**
 * Filter tasks by tab and search query.
 */
export function filterTasks(tasks, { filter, normalizedSearch }) {
  const search = normalizedSearch ?? '';
  return tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed);
    const matchesSearch =
      search.length === 0 || task.text.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });
}

/**
 * Apply a sort strategy to a list of tasks. Tasks preserve order when
 * the comparator returns 0.
 */
export function sortTasks(tasks, sort) {
  const copy = tasks.slice();
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
    case 'alpha':
      return copy.sort((a, b) => a.text.localeCompare(b.text));
    case 'newest':
    default:
      return copy.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }
}

/**
 * Compute aggregate stats for a task list.
 */
export function computeStats(tasks) {
  let completed = 0;
  for (const task of tasks) {
    if (task.completed) completed += 1;
  }
  const total = tasks.length;
  const pending = total - completed;
  const ratio = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, ratio };
}

/**
 * Index a task list by id for O(1) lookups.
 */
export function indexTasksById(tasks) {
  const map = new Map();
  for (const task of tasks) {
    map.set(task.id, task);
  }
  return map;
}
