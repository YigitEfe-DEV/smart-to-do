import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'task-manager-tasks';
const THEME_KEY = 'task-manager-theme';

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
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const remaining = useMemo(
    () => tasks.length,
    [tasks.length],
  );

  const addTask = (event) => {
    event.preventDefault();
    const text = taskText.trim();
    if (!text) return;
    setTasks((current) => [
      { id: crypto.randomUUID(), text },
      ...current,
    ]);
    setTaskText('');
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <main className="page">
      <section className="panel">
        <div className="hero">
          <div>
            <p className="eyebrow">Developer setup</p>
            <h1>Task Manager</h1>
            <p className="subtitle">
              Modern, responsive, localStorage-backed task manager.
            </p>
          </div>
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <form className="composer" onSubmit={addTask}>
          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Add a new task"
            aria-label="New task"
          />
          <button type="submit">Add</button>
        </form>

        <div className="meta">{remaining} tasks</div>

        <ul className="list">
          {tasks.length === 0 ? (
            <li className="empty">No tasks yet.</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="item">
                <span>{task.text}</span>
                <button type="button" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
