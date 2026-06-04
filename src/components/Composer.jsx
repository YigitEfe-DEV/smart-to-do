import { useId, useState } from 'react';
import { TASK_LIMITS } from '../constants/app.js';
import { sanitizeTaskText } from '../utils/tasks.js';

export default function Composer({ onAdd }) {
  const [value, setValue] = useState('');
  const inputId = useId();
  const helperId = `${inputId}-helper`;

  const trimmed = sanitizeTaskText(value);
  const isEmpty = trimmed.length < TASK_LIMITS.minLength;
  const isTooLong = trimmed.length > TASK_LIMITS.maxLength;
  const canSubmit = !isEmpty && !isTooLong;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    if (onAdd(trimmed)) {
      setValue('');
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit} aria-describedby={helperId}>
      <label htmlFor={inputId} className="visually-hidden">
        New task
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Capture a new task"
        aria-describedby={helperId}
        aria-invalid={isTooLong}
        maxLength={TASK_LIMITS.maxLength + 32}
      />
      <button type="submit" disabled={!canSubmit}>
        Add task
      </button>
      <p id={helperId} className="composer-helper" aria-live="polite">
        {isTooLong
          ? `Trim by ${trimmed.length - TASK_LIMITS.maxLength} character${trimmed.length - TASK_LIMITS.maxLength === 1 ? '' : 's'}.`
          : `${trimmed.length}/${TASK_LIMITS.maxLength} characters used.`}
      </p>
    </form>
  );
}
