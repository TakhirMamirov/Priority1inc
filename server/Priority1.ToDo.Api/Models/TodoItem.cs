using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

/// <summary>
/// A todo item as returned by the API.
/// </summary>
public class TodoItem
{
    /// <summary>The todo item id.</summary>
    public int Id { get; set; }

    /// <summary>The id of the todo list the item belongs to.</summary>
    public int TodoListId { get; set; }

    /// <summary>The todo title.</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Whether the todo is complete.</summary>
    public bool IsComplete { get; set; }

    /// <summary>When the todo was created (UTC).</summary>
    public DateTime CreateDate { get; set; }

    /// <summary>When the todo was last changed (UTC).</summary>
    public DateTime UpdateDate { get; set; }

    public static TodoItem From(Todo todo)
    {
        return new TodoItem
        {
            Id = todo.Id,
            TodoListId = todo.TodoListId,
            Title = todo.Title,
            IsComplete = todo.IsComplete,
            CreateDate = todo.CreateDate,
            UpdateDate = todo.UpdateDate
        };
    }

    public Todo ToModel()
    {
        return new Todo
        {
            Id = Id,
            TodoListId = TodoListId,
            Title = Title,
            IsComplete = IsComplete,
            CreateDate = CreateDate,
            UpdateDate = UpdateDate
        };
    }
}
