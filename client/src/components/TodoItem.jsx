import { useEffect, useRef, useState } from 'react';

// Today's local date as yyyy-MM-dd ('en-CA' formats dates that way), so it compares
// directly with the API's dueDate strings.
const today = () => new Date().toLocaleDateString('en-CA');

// "14 Oct" (in the user's locale), with the year only when it isn't this year. The
// parts are split by hand: new Date('2026-10-14') would be UTC midnight and could
// show the previous day west of UTC.
function formatDueDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const sameYear = y === new Date().getFullYear();
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  });
}

// "calendar" icon from Tabler Icons (MIT), inlined like the sidebar's list icon.
function CalendarIcon() {
  return (
    <svg className="calendar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2zM16 3v4M8 3v4M4 11h16" />
    </svg>
  );
}

export default function TodoItem({ todo, onToggle, onRename, onDueDateChange, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  // Typing a date fires a change per keystroke (year 0002, 0020, …), so keep a
  // draft and only save when the field is left or Enter is pressed.
  const [dueDraft, setDueDraft] = useState(todo.dueDate ?? '');
  // The date shows as text (or "Add date"); clicking it swaps in the date field.
  const [editingDate, setEditingDate] = useState(false);
  const dateInput = useRef(null);
  const dateCancelled = useRef(false);

  useEffect(() => {
    if (!editingDate) return;
    dateInput.current.focus();
    try {
      dateInput.current.showPicker();
    } catch {
      // Not supported or not allowed: the focused field still accepts typing.
    }
  }, [editingDate]);

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

  function saveDueDate(e) {
    setEditingDate(false);
    // Escape, or a half-typed date (reads as '' with badInput set): keep the saved date.
    if (dateCancelled.current || e.target.validity.badInput) {
      dateCancelled.current = false;
      setDueDraft(todo.dueDate ?? '');
      return;
    }
    const next = dueDraft || null;
    if (next !== todo.dueDate) onDueDateChange(todo, next);
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

      {editingDate ? (
        <input
          ref={dateInput}
          type="date"
          className={`due-date ${dueDraft ? '' : 'empty'}`}
          title="Due date"
          value={dueDraft}
          onChange={(e) => setDueDraft(e.target.value)}
          onBlur={saveDueDate}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') {
              dateCancelled.current = true;
              e.currentTarget.blur();
            }
          }}
        />
      ) : todo.dueDate ? (
        <button className="due-text" title="Change due date" onClick={() => setEditingDate(true)}>
          <CalendarIcon />
          {formatDueDate(todo.dueDate)}
        </button>
      ) : (
        <button className="add-date" onClick={() => setEditingDate(true)}>
          + Add date
        </button>
      )}

      {!editing && (
        <button className="row-action" onClick={() => setEditing(true)}>Edit</button>
      )}
      <button className="row-action" onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
