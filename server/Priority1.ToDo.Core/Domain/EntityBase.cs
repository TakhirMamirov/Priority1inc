using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Core.Domain;

public abstract class EntityBase
{
    [Key]
    public int Id { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
}