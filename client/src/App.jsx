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

// The sort choice is remembered per browser. Storage can be unavailable (private
// windows, blocked site data), so every access falls back quietly to the default.
const SORT_KEY = 'priority1.todoSort';
const DEFAULT_SORT = 'created-asc';

function loadSort() {
  try {
    const saved = localStorage.getItem(SORT_KEY);
    return SORT_OPTIONS.some((o) => o.value === saved) ? saved : DEFAULT_SORT;
  } catch {
    return DEFAULT_SORT;
  }
}

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [sort, setSort] = useState(loadSort);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // The delete waiting for confirmation: { title, message, action }, or null.
  const [confirm, setConfirm] = useState(null);

  const selectedList = lists.find((l) => l.id === selectedListId);

  useEffect(() => {
    try {
      localStorage.setItem(SORT_KEY, sort);
    } catch {
      // Not saved: the choice still applies for this visit.
    }
  }, [sort]);

  // Load lists once on mount and select the first one.
  useEffect(() => {
    getLists()
      .then((loaded) => {
        setLists(loaded);
        setSelectedListId(loaded[0]?.id ?? null);
        if (loaded.length === 0) setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Couldn't load your lists. Check that the API is running, then refresh the page.");
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
      .catch((e) => {
        console.error(e);
        if (!ignore) setError("Couldn't load this list's todos. Refresh the page to try again.");
      })
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [selectedListId]);

  // Runs a user action: on failure shows a friendly message (raw error goes to the
  // console), on success clears any earlier error.
  async function run(action, failMessage) {
    try {
      await action();
      setError(null);
    } catch (e) {
      console.error(e);
      setError(failMessage);
    }
  }

  const handleCreateList = (name) => run(async () => {
    const created = await createList(name);
    setLists((prev) => [...prev, created]);
    setSelectedListId(created.id);
  }, "Couldn't create the list. Try again.");

  const handleRenameList = (list, name) => run(async () => {
    const updated = await renameList(list.id, name);
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }, "Couldn't rename the list. Try again.");

  function handleDeleteList(list) {
    setConfirm({
      title: 'Delete list?',
      message: <><strong>{list.name}</strong> and all of its todos will be permanently deleted.</>,
      action: () => removeList(list),
    });
  }

  const removeList = (list) => run(async () => {
    await deleteList(list.id);
    const remaining = lists.filter((l) => l.id !== list.id);
    setLists(remaining);
    if (list.id === selectedListId) {
      setSelectedListId(remaining[0]?.id ?? null);
    }
  }, "Couldn't delete the list. Try again.");

  const handleAdd = (title, dueDate) => run(async () => {
    const created = await createTodo(selectedListId, { title, dueDate });
    setTodos((prev) => [...prev, created]);
  }, "Couldn't add the todo. Try again.");

  // PUT replaces the whole todo, so always send every field, not just the changed one.
  const saveTodo = (todo, changes) => run(async () => {
    const updated = await updateTodo(todo.id, { ...todo, ...changes });
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, "Couldn't save your changes. Try again.");

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

  const removeTodo = (todo) => run(async () => {
    await deleteTodo(todo.id);
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  }, "Couldn't delete the todo. Try again.");

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>

      {error && (
        <div className="error" role="alert">
          <span>{error}</span>
          <button className="dismiss" aria-label="Dismiss" onClick={() => setError(null)}>✕</button>
        </div>
      )}

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
              <h2 className="list-title" title={selectedList.name}>{selectedList.name}</h2>
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
