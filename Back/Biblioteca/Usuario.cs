using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Biblioteca;

public class Usuario
{
    [Key]
    public int IdUsuario { get; set; }
    public  string? Nombre { get; set; }
    public required string Email { get; set; }
    public string? PasswordHash { get; set; } 
    public int RolId { get; set; } 
    public Rol? Rol { get; set; }
    public Paciente? Paciente { get; set;}
    public int? IdPaciente {get; set;}
}