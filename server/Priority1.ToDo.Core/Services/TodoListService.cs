using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Services.Interfaces;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services;

/// <summary>
/// EF Core implementation of <see cref="ITodoListService"/>.
/// </summary>
public class TodoListService : ITodoListService
{
    private readonly AppDbContext _context;

    public TodoListService(AppDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<List<TodoList>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.TodoLists.OrderBy(l => l.Id).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<TodoList?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<TodoList> CreateAsync(TodoList listToCreate, CancellationToken ct = default)
    {
        _context.TodoLists.Add(listToCreate);
        await _context.SaveChangesAsync(ct);
        return listToCreate;
    }

    /// <inheritdoc />
    public async Task<TodoList?> UpdateAsync(TodoList listToUpdate, CancellationToken ct = default)
    {
        var list = await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == listToUpdate.Id, ct);
        if (list is null)
        {
            return null;
        }

        list.Name = listToUpdate.Name;

        await _context.SaveChangesAsync(ct);
        return list;
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var list = await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == id, ct);
        if (list is null)
        {
            return false;
        }

        // The list's todos are removed by the cascade-delete foreign key.
        _context.TodoLists.Remove(list);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
