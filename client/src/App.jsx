import { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all todos once on mount.
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}
