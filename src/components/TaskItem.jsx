import { useEffect, useRef, useState } from 'react';
import { TASK_LIMITS } from '../constants/app.js';
import { sanitizeTaskText } from '../utils/tasks.js';

export default function TaskItem({
  task,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleCompleted,
  onDelete,
}) {
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(task.text);
      const id = window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
      return () => window.cancelAnimationFrame(id);
    }
    return undefined;
  }, [isEditing, task.text]);

  useEffect(() => {
    if (!isEditing) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancelEdit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, onCancelEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleaned = sanitizeTaskText(draft);
    if (!cleaned) return;
    onSaveEdit(task.id, cleaned);
  };

  if (isEditing) {
    const tooLong = draft.length > TASK_LIMITS.maxLength;
    return (
      <li className="item item--editing" data-completed={task.completed}>
        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Edit task"
            aria-invalid={tooLong}
            maxLength={TASK_LIMITS.maxLength + 32}
          />
          <div className="item-actions">
            <button type="submit" disabled={!draft.trim() || tooLong}>
              Save
            </button>
            <button type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={task.completed ? 'item item--completed' : 'item'}
      data-completed={task.completed}
    >
      <button
        type="button"
        className="check"
        onClick={() => onToggleCompleted(task.id)}
        aria-pressed={task.completed}
        aria-label={
          task.completed ? 'Mark as active' : 'Mark as completed'
        }
      >
        <span aria-hidden="true">{task.completed ? '✓' : '○'}</span>
      </button>
      <span className="item-text">{task.text}</span>
      <div className="item-actions">
        <button type="button" className="btn-ghost" onClick={() => onStartEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete(task.id)}
          aria-label={`Remove ${task.text}`}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
