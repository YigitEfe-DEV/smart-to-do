import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Apply persisted theme before paint to avoid a flash of wrong colors.
try {
  const stored = window.localStorage.getItem('task-manager-theme');
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.dataset.theme = stored;
  }
} catch {
  /* ignore — the hook will fall back to default */
}
