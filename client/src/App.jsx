import { useEffect, useState } from 'react';
import {
  getTodos, createTodo, updateTodo, deleteTodo,
  getLists, createList, renameList, deleteList,
} from './api';
import AddTodoForm from './components/AddTodoForm';
import ListSidebar from './components/ListSidebar';
import TodoList from './components/TodoList';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedList = lists.find((l) => l.id === selectedListId);

  // Load lists once on mount and select the first one.
  useEffect(() => {
    getLists()
      .then((loaded) => {
        setLists(loaded);
        setSelectedListId(loaded[0]?.id ?? null);
      })
      .catch((e) => setError(e.message));
  }, []);

  // Load all todos once on mount.
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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

  async function handleDeleteList(list) {
    if (!window.confirm(`Delete "${list.name}" and all of its todos?`)) return;
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

  async function handleAdd(title) {
    try {
      const created = await createTodo({ title });
      setTodos((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        isComplete: !todo.isComplete,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRename(todo, title) {
    try {
      const updated = await updateTodo(todo.id, {
        title,
        isComplete: todo.isComplete,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(todo) {
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
          {selectedList && <h2>{selectedList.name}</h2>}

          <AddTodoForm onAdd={handleAdd} />

          {loading ? (
            <p className="muted">Loading…</p>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
