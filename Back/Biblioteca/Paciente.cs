using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca;

public class Paciente
{
    [Key]
    public int IdPaciente { get; set; }
    public string? Nombre { get; set; }
    public required string Dni { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }

}
