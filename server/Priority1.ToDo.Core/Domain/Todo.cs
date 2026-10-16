namespace Priority1.ToDo.Core.Domain;

using System.ComponentModel.DataAnnotations;

public class Todo : EntityBase
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public bool IsComplete { get; set; } = false;

    // A calendar day, not a point in time, so it can't shift across time zones.
    public DateOnly? DueDate { get; set; }

    public int TodoListId { get; set; }

    public TodoList? TodoList { get; set; }
}
