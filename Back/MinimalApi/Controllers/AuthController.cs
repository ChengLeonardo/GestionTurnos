using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Biblioteca;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace MinimalApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly Pass _passwordService;
    private readonly IConfiguration config;

    public AuthController(AppDbContext context, Pass passwordService, IConfiguration    configuration)
    {
        _context = context;
        _passwordService = passwordService;
        config = configuration;
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
            Console.WriteLine(_passwordService.HashPassword(model.Password));
            Console.WriteLine(user.PasswordHash);
            return Unauthorized("Credenciales incorrectas.");
        }
        var jwt = CreateJwtToken(user);
        return Ok(new { token = jwt });

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
        

        
    string CreateJwtToken(Usuario usuario)
    {
        var jwtSettings = config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        Console.WriteLine(usuario.Nombre);
        var claims = new[]
        {
            new Claim("idPaciente", usuario.IdPaciente.ToString()),
            new Claim(ClaimTypes.Name, usuario.Nombre),
            new Claim(ClaimTypes.Role, usuario.Rol.Nombre),
            new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    }
