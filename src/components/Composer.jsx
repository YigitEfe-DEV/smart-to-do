import { useId, useState } from 'react';
import { TASK_LIMITS } from '../constants/app.js';
import { sanitizeTaskText } from '../utils/tasks.js';

export default function Composer({ onAdd }) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const inputId = useId();
  const helperId = `${inputId}-helper`;

  const trimmed = sanitizeTaskText(value);
  const isEmpty = trimmed.length < TASK_LIMITS.minLength;
  const isTooLong = trimmed.length > TASK_LIMITS.maxLength;
  const remaining = TASK_LIMITS.maxLength - trimmed.length;
  const showError = touched && (isTooLong || (isEmpty && value.length > 0));

  let helperText;
  if (isTooLong) {
    helperText = `Trim by ${trimmed.length - TASK_LIMITS.maxLength} character${
      trimmed.length - TASK_LIMITS.maxLength === 1 ? '' : 's'
    } to continue.`;
  } else if (isEmpty && value.length > 0) {
    helperText = 'Add at least one character before saving.';
  } else {
    helperText = `${trimmed.length}/${TASK_LIMITS.maxLength} — ${remaining} remaining.`;
  }

  const canSubmit = !isEmpty && !isTooLong;

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    if (onAdd(trimmed)) {
      setValue('');
      setTouched(false);
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="visually-hidden">
        New task
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="Capture a new task"
        aria-describedby={helperId}
        aria-invalid={showError}
        maxLength={TASK_LIMITS.maxLength + 32}
        autoComplete="off"
      />
      <button type="submit" disabled={!canSubmit}>
        Add task
      </button>
      <p
        id={helperId}
        className={
          showError ? 'composer-helper composer-helper--error' : 'composer-helper'
        }
        aria-live="polite"
      >
        {helperText}
      </p>
    </form>
  );
}
