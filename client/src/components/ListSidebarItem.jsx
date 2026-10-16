import { useState } from 'react';

// "list-check" icon from Tabler Icons (MIT), inlined to avoid an icon library.
function ListIcon() {
  return (
    <svg className="list-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 5.5l1.5 1.5l2.5 -2.5M3.5 11.5l1.5 1.5l2.5 -2.5M3.5 17.5l1.5 1.5l2.5 -2.5M11 6h9M11 12h9M11 18h9" />
    </svg>
  );
}

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
      <ListIcon />
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
