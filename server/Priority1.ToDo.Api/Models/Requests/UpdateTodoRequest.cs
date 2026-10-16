using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

/// <summary>
/// Request body for updating a todo item.
/// </summary>
public class UpdateTodoRequest
{
    /// <summary>The todo title. Required, up to 200 characters.</summary>
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Whether the todo is complete.</summary>
    public bool IsComplete { get; set; }

    /// <summary>Due date (<c>yyyy-MM-dd</c>); <c>null</c> or omitted clears it.</summary>
    public DateOnly? DueDate { get; set; }

    public Todo ToModel(int id)
    {
        return new Todo
        {
            Id = id,
            Title = Title,
            IsComplete = IsComplete,
            DueDate = DueDate
        };
    }
}
