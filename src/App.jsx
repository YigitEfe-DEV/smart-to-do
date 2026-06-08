import { useEffect, useMemo, useState } from 'react';
import { APP_VERSION, FILTERS, SORT_OPTIONS } from './constants/app.js';
import { useTasks } from './hooks/useTasks.js';
import { useTheme } from './hooks/useTheme.js';
import Composer from './components/Composer.jsx';
import StatsGrid from './components/StatsGrid.jsx';
import Hero from './components/Hero.jsx';
import Toolbar from './components/Toolbar.jsx';
import TaskItem from './components/TaskItem.jsx';
import { computeStats, filterTasks, sortTasks } from './utils/tasks.js';

export default function App() {
  const { tasks, addTask, editTaskText, toggleTask, deleteTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
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
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id, text) => {
    if (editTaskText(id, text)) {
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
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onToggleCompleted={toggleCompleted}
                onDelete={requestDeleteTask}
              />
            ))
          )}
        </ul>
        <footer className="footer">
          <span>Version {APP_VERSION}</span>
        </footer>
      </section>
    </main>
  );
}
