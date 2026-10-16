using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

/// <summary>
/// Request body for creating a todo list.
/// </summary>
public class CreateTodoListRequest
{
    /// <summary>The list name. Required, up to 100 characters.</summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public TodoList ToModel()
    {
        return new TodoList
        {
            Name = Name.Trim()
        };
    }
}
