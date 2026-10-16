import { useState } from 'react';

// Today's local date as yyyy-MM-dd ('en-CA' formats dates that way), so it compares
// directly with the API's dueDate strings.
const today = () => new Date().toLocaleDateString('en-CA');

export default function TodoItem({ todo, onToggle, onRename, onDueDateChange, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const open = !todo.isComplete && todo.dueDate !== null;
  const now = today();
  const overdue = open && todo.dueDate < now;
  const dueToday = open && todo.dueDate === now;

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      onRename(todo, trimmed);
    } else {
      setDraft(todo.title);
    }
    setEditing(false);
  }

  return (
    <li className={`todo-item ${overdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => onToggle(todo)}
        title="Mark complete / incomplete"
      />

      {editing ? (
        <input
          className="edit-title"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') {
              setDraft(todo.title);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span
          className={`title ${todo.isComplete ? 'complete' : ''}`}
          onDoubleClick={() => setEditing(true)}
          title={`${todo.title}\n(double-click to edit)`}
        >
          {todo.title}
        </span>
      )}

      {overdue && <span className="badge overdue">Overdue</span>}
      {dueToday && <span className="badge due-today">Due today</span>}

      <input
        type="date"
        className={`due-date ${todo.dueDate ? '' : 'empty'}`}
        title="Due date"
        value={todo.dueDate ?? ''}
        onChange={(e) => onDueDateChange(todo, e.target.value || null)}
      />

      {!editing && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      <button onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
