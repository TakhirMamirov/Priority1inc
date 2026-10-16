export const SORT_OPTIONS = [
  { value: 'created-asc', label: 'Created, oldest first' },
  { value: 'created-desc', label: 'Created, newest first' },
  { value: 'due-asc', label: 'Due date, soonest first' },
  { value: 'due-desc', label: 'Due date, latest first' },
];

// Ids increase in creation order, so they sort by create date without parsing
// the API's createDate strings. Due dates are yyyy-MM-dd, so they compare as text;
// todos without one always go last, whichever the direction.
export function sortTodos(todos, sort) {
  const [field, dir] = sort.split('-');
  const sign = dir === 'asc' ? 1 : -1;

  return [...todos].sort((a, b) => {
    if (field === 'created') return (a.id - b.id) * sign;

    if (a.dueDate === b.dueDate) return a.id - b.id;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate < b.dueDate ? -sign : sign;
  });
}
