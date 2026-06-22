import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

/**
 * Modal confirm dialog with focus trap and Escape support.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    const id = window.requestAnimationFrame(() => {
      confirmRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(id);
      const target = previousFocus.current;
      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const toneClass = tone === 'danger' ? 'dialog--danger' : 'dialog--info';

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className={`dialog ${toneClass}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <h2 id="dialog-title" className="dialog-title">{title}</h2>
        <p id="dialog-description" className="dialog-description">{description}</p>
        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={tone === 'danger' ? 'danger-solid' : 'primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
