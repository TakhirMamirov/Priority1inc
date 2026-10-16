using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services.Interfaces;

/// <summary>
/// Manages todo items. Every todo item belongs to exactly one todo list.
/// </summary>
public interface ITodoService
{
    /// <summary>
    /// Gets all todo items in a list, oldest first.
    /// </summary>
    /// <param name="todoListId">The id of the list.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The list's todo items (empty if it has none), or <c>null</c> if the list does not exist.</returns>
    Task<List<Todo>?> GetByListIdAsync(int todoListId, CancellationToken ct = default);

    /// <summary>
    /// Gets a single todo item by its id.
    /// </summary>
    /// <param name="id">The todo item id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The todo item, or <c>null</c> if it does not exist.</returns>
    Task<Todo?> GetByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Creates a todo item in the list given by <see cref="Todo.TodoListId"/>.
    /// </summary>
    /// <param name="itemToCreate">The todo item to create.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The created todo item, or <c>null</c> if its list does not exist.</returns>
    Task<Todo?> CreateAsync(Todo itemToCreate, CancellationToken ct = default);

    /// <summary>
    /// Updates the title, completion state and due date of a todo item. The item stays in its list.
    /// </summary>
    /// <param name="itemToUpdate">The todo item carrying the id to update and its new values.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The updated todo item, or <c>null</c> if it does not exist.</returns>
    Task<Todo?> UpdateAsync(Todo itemToUpdate, CancellationToken ct = default);

    /// <summary>
    /// Deletes a todo item.
    /// </summary>
    /// <param name="id">The todo item id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns><c>true</c> if the item was deleted; <c>false</c> if it does not exist.</returns>
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
