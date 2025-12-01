using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace Biblioteca;

public class Sede
{
    [Key]
    public int IdSede { get; set; }
    public string? Nombre { get; set; }
    public string? Direccion { get; set; }
    [JsonIgnore]
    public List<AgendaMedica> AgendaMedicas {get;set;}
}
