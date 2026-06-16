import TaskItem from './TaskItem.jsx';
import { FILTERS } from '../constants/app.js';

const EMPTY_MESSAGES = {
  [FILTERS.all]: {
    icon: '✶',
    title: 'Your workspace is clear',
    body: 'Capture a task above to start tracking your flow.',
  },
  [FILTERS.active]: {
    icon: '✓',
    title: 'Nothing pending',
    body: 'All tasks are complete. Add a new task or revisit an archived idea.',
  },
  [FILTERS.completed]: {
    icon: '◌',
    title: 'No completed tasks yet',
    body: 'Mark tasks as complete to see them grouped here.',
  },
};

function buildContextState({ filter, hasQuery, hasAnyTask }) {
  if (hasQuery) {
    return {
      icon: '⌕',
      title: 'No matches found',
      body: 'Try a shorter keyword or clear the search to see all tasks.',
    };
  }
  if (!hasAnyTask) {
    return {
      icon: '✶',
      title: 'Start with one task',
      body: 'Capture a single task above to populate your workspace.',
    };
  }
  return EMPTY_MESSAGES[filter] ?? EMPTY_MESSAGES[FILTERS.all];
}

export default function TaskList({
  tasks,
  hasAnyTask,
  hasActiveQuery,
  filter,
  editingId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleCompleted,
  onDelete,
  onClearSearch,
}) {
  if (tasks.length === 0) {
    const state = buildContextState({
      filter,
      hasQuery: hasActiveQuery,
      hasAnyTask,
    });
    return (
      <ul className="list list--empty" aria-live="polite">
        <li className="empty">
          <span className="empty-icon" aria-hidden="true">{state.icon}</span>
          <span className="empty-title">{state.title}</span>
          <span className="empty-subtitle">{state.body}</span>
          {hasActiveQuery && onClearSearch ? (
            <button
              type="button"
              className="btn-link"
              onClick={onClearSearch}
            >
              Clear search
            </button>
          ) : null}
        </li>
      </ul>
    );
  }

  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
