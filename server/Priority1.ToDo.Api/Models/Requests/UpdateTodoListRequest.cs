using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

/// <summary>
/// Request body for renaming a todo list.
/// </summary>
public class UpdateTodoListRequest
{
    /// <summary>The new list name. Required, up to 100 characters.</summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public TodoList ToModel(int id)
    {
        return new TodoList
        {
            Id = id,
            Name = Name.Trim()
        };
    }
}
