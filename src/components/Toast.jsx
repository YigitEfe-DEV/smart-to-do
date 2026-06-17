import { useEffect, useState } from 'react';
import { STORAGE_ERROR_EVENT } from '../constants/app.js';

/**
 * Listens for storage-error events emitted by the persistence helpers and
 * surfaces a small dismissible banner so users know data may not persist.
 */
export default function Toast() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      const detail = event?.detail ?? {};
      const op = detail.op === 'write' ? 'save' : 'load';
      setMessage(`Couldn't ${op} your tasks — local storage is unavailable.`);
    };
    window.addEventListener(STORAGE_ERROR_EVENT, handler);
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, handler);
  }, []);

  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={() => setMessage(null)}
      >
        ×
      </button>
    </div>
  );
}
