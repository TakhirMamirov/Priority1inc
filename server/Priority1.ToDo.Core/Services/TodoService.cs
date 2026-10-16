using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Services.Interfaces;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services;

/// <summary>
/// EF Core implementation of <see cref="ITodoService"/>.
/// </summary>
public class TodoService : ITodoService
{
    private readonly AppDbContext _context;

    public TodoService(AppDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<List<Todo>?> GetByListIdAsync(int todoListId, CancellationToken ct = default)
    {
        if (!await ListExistsAsync(todoListId, ct))
        {
            return null;
        }

        return await _context.Todos
            .Where(t => t.TodoListId == todoListId)
            .OrderBy(t => t.Id)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<Todo?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Todos.FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<Todo?> CreateAsync(Todo itemToCreate, CancellationToken ct = default)
    {
        if (!await ListExistsAsync(itemToCreate.TodoListId, ct))
        {
            return null;
        }

        _context.Todos.Add(itemToCreate);
        await _context.SaveChangesAsync(ct);
        return itemToCreate;
    }

    /// <inheritdoc />
    public async Task<Todo?> UpdateAsync(Todo itemToUpdate, CancellationToken ct = default)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == itemToUpdate.Id, ct);
        if (todo is null)
        {
            return null;
        }

        todo.Title = itemToUpdate.Title;
        todo.IsComplete = itemToUpdate.IsComplete;

        await _context.SaveChangesAsync(ct);
        return todo;
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (todo is null)
        {
            return false;
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private Task<bool> ListExistsAsync(int todoListId, CancellationToken ct)
    {
        return _context.TodoLists.AnyAsync(l => l.Id == todoListId, ct);
    }
}
