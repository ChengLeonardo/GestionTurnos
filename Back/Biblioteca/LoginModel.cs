using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca;

public class LoginModel
{
    public   string? Email { get; set; }
    public required string Password { get; set; }

    public class CrearUsuarioModel
    {
        public string? Nombre { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Rol { get; set; }  // Rol del usuario (Admin, Profesional, Recep)
    }
}