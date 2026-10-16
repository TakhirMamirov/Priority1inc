using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services.Interfaces;

/// <summary>
/// Manages todo lists: the containers that group todo items.
/// </summary>
public interface ITodoListService
{
    /// <summary>
    /// Gets all todo lists, oldest first.
    /// </summary>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>All lists; an empty list if none exist.</returns>
    Task<List<TodoList>> GetAllAsync(CancellationToken ct = default);

    /// <summary>
    /// Gets a single todo list by its id.
    /// </summary>
    /// <param name="id">The list id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The list, or <c>null</c> if it does not exist.</returns>
    Task<TodoList?> GetByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Creates a new todo list.
    /// </summary>
    /// <param name="listToCreate">The list to create; only <see cref="TodoList.Name"/> is used.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The created list, including its generated id and dates.</returns>
    Task<TodoList> CreateAsync(TodoList listToCreate, CancellationToken ct = default);

    /// <summary>
    /// Renames an existing todo list.
    /// </summary>
    /// <param name="listToUpdate">The list carrying the id to update and its new name.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The updated list, or <c>null</c> if it does not exist.</returns>
    Task<TodoList?> UpdateAsync(TodoList listToUpdate, CancellationToken ct = default);

    /// <summary>
    /// Deletes a todo list together with all todo items that belong to it.
    /// </summary>
    /// <param name="id">The list id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns><c>true</c> if the list was deleted; <c>false</c> if it does not exist.</returns>
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
