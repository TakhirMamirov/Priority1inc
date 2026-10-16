import { useState } from 'react';

export default function ListSidebarItem({ list, selected, onSelect, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(list.name);

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== list.name) {
      onRename(list, trimmed);
    } else {
      setDraft(list.name);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="list-nav-item">
        <input
          className="edit-title"
          value={draft}
          maxLength={100}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') {
              setDraft(list.name);
              setEditing(false);
            }
          }}
        />
      </li>
    );
  }

  return (
    <li
      className={`list-nav-item ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(list)}
      onDoubleClick={() => setEditing(true)}
      title="Double-click to rename"
    >
      <span className="name">{list.name}</span>
      <button className="icon" title="Rename list" onClick={(e) => { e.stopPropagation(); setEditing(true); }}>
        ✎
      </button>
      <button className="icon" title="Delete list" onClick={(e) => { e.stopPropagation(); onDelete(list); }}>
        ✕
      </button>
    </li>
  );
}
