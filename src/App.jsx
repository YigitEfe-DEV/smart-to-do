import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'task-manager-tasks';
const THEME_KEY = 'task-manager-theme';
const VERSION = '1.1.0';

function readStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

export default function App() {
  const [tasks, setTasks] = useState(readStoredTasks);
  const [taskText, setTaskText] = useState('');
  const [editText, setEditText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        task.text.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, normalizedSearch]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.length - completed;
    return {
      total: tasks.length,
      completed,
      pending,
    };
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    const text = taskText.trim();
    if (!text) return;
    setTasks((current) => [
      { id: crypto.randomUUID(), text, completed: false },
      ...current,
    ]);
    setTaskText('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (event) => {
    event.preventDefault();
    const text = editText.trim();
    if (!text) return;
    setTasks((current) =>
      current.map((task) =>
        task.id === editingId ? { ...task, text } : task,
      ),
    );
    cancelEdit();
  };

  const deleteTask = (id) => {
    const task = tasks.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Remove "${task?.text ?? 'this task'}"?`,
    );
    if (!confirmed) return;
    setTasks((current) => current.filter((item) => item.id !== id));
  };

  const toggleCompleted = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <main className="page">
      <section className="panel">
        {isLoading && (
          <div className="loading-overlay" aria-live="polite" aria-busy="true">
            <div className="loading-card">
              <div className="spinner" />
              <span>Loading workspace</span>
            </div>
          </div>
        )}
        <div className="hero">
          <div>
            <p className="eyebrow">Personal workflow</p>
            <h1>LumaFlow</h1>
            <p className="subtitle">
              A focused task workspace with a clean, adaptive interface.
            </p>
          </div>
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
        </div>

        <div className="stats-grid" aria-label="Task statistics">
          <article className="stat-card">
            <span>Total tasks</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="stat-card">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </article>
          <article className="stat-card">
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </article>
        </div>

        <form className="composer" onSubmit={addTask}>
          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Capture a new task"
            aria-label="New task"
          />
          <button type="submit" disabled={!taskText.trim()}>
            Add task
          </button>
        </form>

        <div className="toolbar">
          <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
          />
          <div className="filters" role="tablist" aria-label="Task filters">
            {[
              ['all', 'All'],
              ['active', 'Active'],
              ['completed', 'Completed'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'filter active' : 'filter'}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="list">
          {filteredTasks.length === 0 ? (
            <li className="empty">Your workspace is clear.</li>
          ) : (
            filteredTasks.map((task) =>
              editingId === task.id ? (
                <li key={task.id} className="item editing">
                  <form className="edit-form" onSubmit={saveEdit}>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      aria-label="Edit task"
                    />
                    <div className="item-actions">
                      <button type="submit" disabled={!editText.trim()}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </li>
              ) : (
                <li
                  key={task.id}
                  className={task.completed ? 'item completed' : 'item'}
                >
                  <button
                    type="button"
                    className="check"
                    onClick={() => toggleCompleted(task.id)}
                    aria-label={
                      task.completed ? 'Mark as active' : 'Mark as completed'
                    }
                  >
                    {task.completed ? '✓' : '○'}
                  </button>
                  <span>{task.text}</span>
                  <div className="item-actions">
                    <button type="button" onClick={() => startEdit(task)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteTask(task.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ),
            )
          )}
        </ul>
        <footer className="footer">
          <span>Version {VERSION}</span>
        </footer>
      </section>
    </main>
  );
}
