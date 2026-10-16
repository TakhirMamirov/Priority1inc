using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

/// <summary>
/// A todo list as returned by the API.
/// </summary>
public class TodoListItem
{
    /// <summary>The list id.</summary>
    public int Id { get; set; }

    /// <summary>The list name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>When the list was created (UTC).</summary>
    public DateTime CreateDate { get; set; }

    /// <summary>When the list was last changed (UTC).</summary>
    public DateTime UpdateDate { get; set; }

    public static TodoListItem From(TodoList list)
    {
        return new TodoListItem
        {
            Id = list.Id,
            Name = list.Name,
            CreateDate = list.CreateDate,
            UpdateDate = list.UpdateDate
        };
    }
}
