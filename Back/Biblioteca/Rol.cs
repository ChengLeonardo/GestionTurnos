using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Biblioteca;

public class Rol
{
    [Key]
    public int IdRol { get; set; }
    public string? Nombre { get; set; }
    public List<Usuario>? Usuarios { get; set; }
}