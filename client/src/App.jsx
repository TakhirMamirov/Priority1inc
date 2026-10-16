import { useEffect, useState } from 'react';
import {
  getTodos, createTodo, updateTodo, deleteTodo,
  getLists, createList, renameList, deleteList,
} from './api';
import AddTodoForm from './components/AddTodoForm';
import ConfirmDialog from './components/ConfirmDialog';
import ListSidebar from './components/ListSidebar';
import TodoList from './components/TodoList';
import { SORT_OPTIONS, sortTodos } from './sortTodos';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [sort, setSort] = useState('created-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // The delete waiting for confirmation: { title, message, action }, or null.
  const [confirm, setConfirm] = useState(null);

  const selectedList = lists.find((l) => l.id === selectedListId);

  // Load lists once on mount and select the first one.
  useEffect(() => {
    getLists()
      .then((loaded) => {
        setLists(loaded);
        setSelectedListId(loaded[0]?.id ?? null);
        if (loaded.length === 0) setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Reload todos whenever the selected list changes. `ignore` drops a response
  // that arrives after the user has already switched to another list.
  useEffect(() => {
    if (selectedListId === null) return;
    let ignore = false;
    setLoading(true);
    getTodos(selectedListId)
      .then((loaded) => !ignore && setTodos(loaded))
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [selectedListId]);

  async function handleCreateList(name) {
    try {
      const created = await createList(name);
      setLists((prev) => [...prev, created]);
      setSelectedListId(created.id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRenameList(list, name) {
    try {
      const updated = await renameList(list.id, name);
      setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    } catch (e) {
      setError(e.message);
    }
  }

  function handleDeleteList(list) {
    setConfirm({
      title: 'Delete list?',
      message: <><strong>{list.name}</strong> and all of its todos will be permanently deleted.</>,
      action: () => removeList(list),
    });
  }

  async function removeList(list) {
    try {
      await deleteList(list.id);
      const remaining = lists.filter((l) => l.id !== list.id);
      setLists(remaining);
      if (list.id === selectedListId) {
        setSelectedListId(remaining[0]?.id ?? null);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAdd(title, dueDate) {
    try {
      const created = await createTodo(selectedListId, { title, dueDate });
      setTodos((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  // PUT replaces the whole todo, so always send every field, not just the changed one.
  async function saveTodo(todo, changes) {
    try {
      const updated = await updateTodo(todo.id, { ...todo, ...changes });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  const handleToggle = (todo) => saveTodo(todo, { isComplete: !todo.isComplete });
  const handleRename = (todo, title) => saveTodo(todo, { title });
  const handleDueDateChange = (todo, dueDate) => saveTodo(todo, { dueDate });

  function handleDelete(todo) {
    setConfirm({
      title: 'Delete todo?',
      message: <><strong>{todo.title}</strong> will be permanently deleted.</>,
      action: () => removeTodo(todo),
    });
  }

  async function removeTodo(todo) {
    try {
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>

      {error && <div className="error">{error}</div>}

      <div className="layout">
        <ListSidebar
          lists={lists}
          selectedListId={selectedListId}
          onSelect={(list) => setSelectedListId(list.id)}
          onCreate={handleCreateList}
          onRename={handleRenameList}
          onDelete={handleDeleteList}
        />

        <main>
          {loading ? (
            <p className="muted">Loading…</p>
          ) : !selectedList ? (
            <p className="muted">Create a list to get started.</p>
          ) : (
            <>
              <h2>{selectedList.name}</h2>
              <AddTodoForm onAdd={handleAdd} />
              {todos.length > 0 && (
                <div className="toolbar">
                  <label>
                    Sort by{' '}
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
              <TodoList
                todos={sortTodos(todos, sort)}
                onToggle={handleToggle}
                onRename={handleRename}
                onDueDateChange={handleDueDateChange}
                onDelete={handleDelete}
              />
            </>
          )}
        </main>
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            setConfirm(null);
            confirm.action();
          }}
        />
      )}
    </div>
  );
}
