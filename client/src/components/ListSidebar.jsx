import { useState } from 'react';
import ListSidebarItem from './ListSidebarItem';

export default function ListSidebar({ lists, selectedListId, onSelect, onCreate, onRename, onDelete }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
  }

  return (
    <aside className="sidebar">
      <h2>Lists</h2>

      {lists.length === 0 ? (
        <p className="muted">No lists yet.</p>
      ) : (
        <ul className="list-nav">
          {lists.map((list) => (
            <ListSidebarItem
              key={list.id}
              list={list}
              selected={list.id === selectedListId}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New list"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </aside>
  );
}
