
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TODOS_URL = `${API_BASE_URL}/todos`;

async function handle(res) {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  // 204 No Content (e.g. DELETE) has no body to parse.
  return res.status === 204 ? null : res.json();
}

export function getTodos() {
  return fetch(TODOS_URL).then(handle);
}

export function createTodo({ title, isComplete = false }) {
  return fetch(TODOS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete }),
  }).then(handle);
}

export function updateTodo(id, { title, isComplete }) {
  return fetch(`${TODOS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete }),
  }).then(handle);
}

export function deleteTodo(id) {
  return fetch(`${TODOS_URL}/${id}`, { method: 'DELETE' }).then(handle);
}
