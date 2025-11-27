using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
namespace Biblioteca;
public class Profesional
{
    [Key]
    public int IdProfesional {get;set;}
    public string? Nombre {get;set;}
    public int IdEspecialidad {get;set;}
    public Especialidad? Especialidad {get;set;}
    public int IdSede {get;set;}
    public Sede? Sede {get;set;}
    [JsonIgnore]
    public List<Turno> Turnos {get;set;}
    public List<Orden> Ordenes {get;set;}
}
