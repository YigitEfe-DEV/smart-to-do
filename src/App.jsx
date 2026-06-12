import { useEffect, useMemo, useState } from 'react';
import { APP_VERSION, FILTERS } from './constants/app.js';
import { useTasks } from './hooks/useTasks.js';
import { useTheme } from './hooks/useTheme.js';
import { useSort } from './hooks/useSort.js';
import Composer from './components/Composer.jsx';
import StatsGrid from './components/StatsGrid.jsx';
import Hero from './components/Hero.jsx';
import Toolbar from './components/Toolbar.jsx';
import TaskList from './components/TaskList.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import { computeStats, filterTasks, sortTasks } from './utils/tasks.js';

export default function App() {
  const { tasks, addTask, editTaskText, toggleTask, deleteTask, clearCompleted } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const { sort, setSort } = useSort();
  const [editingId, setEditingId] = useState(null);
  const [pendingDeletion, setPendingDeletion] = useState(null);
  const [filter, setFilter] = useState(FILTERS.all);
  const [search, setSearch] = useState('');
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
    if (!task) return;
    setPendingDeletion(task);
  };

  const confirmDeletion = () => {
    if (pendingDeletion) {
      deleteTask(pendingDeletion.id);
    }
    setPendingDeletion(null);
  };

  const cancelDeletion = () => {
    setPendingDeletion(null);
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
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />

        <TaskList
          tasks={filteredTasks}
          editingId={editingId}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onSaveEdit={saveEdit}
          onToggleCompleted={toggleCompleted}
          onDelete={requestDeleteTask}
        />
        <ConfirmDialog
          open={pendingDeletion !== null}
          title="Remove this task?"
          description={
            pendingDeletion
              ? `“${pendingDeletion.text}” will be deleted from your workspace.`
              : ''
          }
          confirmLabel="Remove"
          cancelLabel="Keep"
          tone="danger"
          onConfirm={confirmDeletion}
          onCancel={cancelDeletion}
        />
        <footer className="footer">
          <span>Version {APP_VERSION}</span>
        </footer>
      </section>
    </main>
  );
}
