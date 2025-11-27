using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Biblioteca;

public class Especialidad
{
    [Key]
    public int IdEspecialidad {get;set;}
    public string? Nombre { get; set; }
    [JsonIgnore]
    public List<Profesional> Profesionales {get;set;}
}