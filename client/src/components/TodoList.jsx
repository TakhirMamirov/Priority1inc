import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onRename, onDueDateChange, onDelete }) {
  if (todos.length === 0) {
    return <p className="muted">No todos yet. Add one above.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onDueDateChange={onDueDateChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
