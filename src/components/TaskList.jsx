import TaskItem from './TaskItem.jsx';

export default function TaskList({
  tasks,
  editingId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleCompleted,
  onDelete,
}) {
  if (tasks.length === 0) {
    return (
      <ul className="list list--empty" aria-live="polite">
        <li className="empty">
          <span className="empty-title">Your workspace is clear</span>
          <span className="empty-subtitle">
            Capture a task above to start tracking your flow.
          </span>
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
