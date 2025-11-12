using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Biblioteca;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MinimalApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly Pass _passwordService;

    public AuthController(AppDbContext context, Pass passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    // Login endpoint
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _context.Usuarios
            .Include(u => u.Rol) // Incluimos la relación con el rol
            .FirstOrDefaultAsync(u => u.Email == model.Email);

        if (user == null || user.PasswordHash != _passwordService.HashPassword(model.Password))
        {
            return Unauthorized("Credenciales incorrectas.");
        }


        // Generar token JWT
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ClaveSuperSecretaParaGestionTurnos123!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim("id", user.IdUsuario.ToString()),
            new Claim("rol", user.Rol.Nombre)
        };

        var token = new JwtSecurityToken(
            issuer: "GestionTurnosAPI",
            audience: "GestionTurnosClient",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new
        {
            Token = tokenString,
            Usuario = new
            {
                user.IdUsuario,
                user.Nombre,
                user.Email,
                Rol = user.Rol.Nombre
            }
        });

    }

    // Crear usuario 
    [HttpPost("crear")]
    public async Task<IActionResult> CrearUsuario([FromBody] Biblioteca.LoginModel.CrearUsuarioModel model)
    {
        var rol = await _context.Rols.FirstOrDefaultAsync(r => r.Nombre == model.Rol);
        if (rol == null)
        {
            return BadRequest("Rol no encontrado.");
        }

        var usuario = new Usuario
        {
            Nombre = model.Nombre,
            Email = model.Email,
            PasswordHash = _passwordService.HashPassword(model.Password),
            RolId = rol.IdRol
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(usuario);
    }
    
}
