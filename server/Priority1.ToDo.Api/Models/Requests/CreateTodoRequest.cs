using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

/// <summary>
/// Request body for creating a todo item. The list comes from the route.
/// </summary>
public class CreateTodoRequest
{
    /// <summary>The todo title. Required, up to 200 characters.</summary>
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Whether the todo starts out complete. Defaults to <c>false</c>.</summary>
    public bool IsComplete { get; set; }

    /// <summary>Optional due date (<c>yyyy-MM-dd</c>).</summary>
    public DateOnly? DueDate { get; set; }

    public Todo ToModel(int todoListId)
    {
        return new Todo
        {
            Title = Title,
            IsComplete = IsComplete,
            DueDate = DueDate,
            TodoListId = todoListId
        };
    }
}
