using System.ComponentModel.DataAnnotations;

namespace Biblioteca;

public class Especialidad
{
    [Key]
    public int IdEspecialidad {get;set;}
    public string? Nombre { get; set; }
}