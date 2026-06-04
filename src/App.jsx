import { useEffect, useMemo, useState } from 'react';
import { APP_VERSION } from './constants/app.js';
import { useTasks } from './hooks/useTasks.js';
import { useTheme } from './hooks/useTheme.js';
import Composer from './components/Composer.jsx';

export default function App() {
  const { tasks, addTask, editTaskText, toggleTask, deleteTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [editText, setEditText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const addTaskHandler = (text) => addTask(text);

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
    if (editTaskText(editingId, editText)) {
      cancelEdit();
    }
  };

  const requestDeleteTask = (id) => {
    const task = tasks.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Remove "${task?.text ?? 'this task'}"?`,
    );
    if (!confirmed) return;
    deleteTask(id);
  };

  const toggleCompleted = (id) => {
    toggleTask(id);
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
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
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

        <Composer onAdd={addTaskHandler} />

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
                    <button type="button" onClick={() => requestDeleteTask(task.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ),
            )
          )}
        </ul>
        <footer className="footer">
          <span>Version {APP_VERSION}</span>
        </footer>
      </section>
    </main>
  );
}
