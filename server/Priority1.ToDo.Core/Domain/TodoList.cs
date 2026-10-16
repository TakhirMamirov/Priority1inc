namespace Priority1.ToDo.Core.Domain;

using System.ComponentModel.DataAnnotations;

public class TodoList : EntityBase
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public ICollection<Todo> Todos { get; set; } = new List<Todo>();
}
