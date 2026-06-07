import { useEffect, useMemo, useState } from 'react';
import { APP_VERSION, FILTERS, SORT_OPTIONS } from './constants/app.js';
import { useTasks } from './hooks/useTasks.js';
import { useTheme } from './hooks/useTheme.js';
import Composer from './components/Composer.jsx';
import StatsGrid from './components/StatsGrid.jsx';
import Hero from './components/Hero.jsx';
import Toolbar from './components/Toolbar.jsx';
import { computeStats, filterTasks, sortTasks } from './utils/tasks.js';

export default function App() {
  const { tasks, addTask, editTaskText, toggleTask, deleteTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [editText, setEditText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState(FILTERS.all);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(SORT_OPTIONS.newest);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(tasks, { filter, normalizedSearch });
    return sortTasks(filtered, sort);
  }, [tasks, filter, normalizedSearch, sort]);

  const stats = useMemo(() => computeStats(tasks), [tasks]);

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
        <Hero theme={theme} onToggleTheme={toggleTheme} />

        <StatsGrid stats={stats} />

        <Composer onAdd={addTaskHandler} />

        <Toolbar
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          resultsCount={filteredTasks.length}
          totalCount={tasks.length}
        />

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
