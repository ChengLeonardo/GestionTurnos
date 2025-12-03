using Microsoft.EntityFrameworkCore;
using Biblioteca;
using DTOs;

namespace MinimalApi.Endpoints;

public static class UsersEndpoints
{
    public static void MapUsersEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/users");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var userstest = await db.Usuarios.Include(u => u.Rol).Include(u => u.Paciente).ToListAsync();
            foreach (var user in userstest)
            {
                Console.WriteLine($"User: {user.Nombre}, Role: {user.Rol?.Nombre}, Patient: {user.Paciente?.Nombre}");
            }
            var users = await db.Usuarios
                .Include(u => u.Rol)
                .Include(u => u.Paciente)
                .Select(u => new UserDto
                {
                    Id = u.IdUsuario,
                    Nombre = u.Nombre ?? "Sin Nombre",
                    Email = u.Email,
                    Rol = u.Rol == null ? "Sin Rol" : (u.Rol.Nombre ?? "Sin Rol"),
                    RolId = u.RolId,
                    Dni = u.Paciente.Dni == null ? "Sin DNI" : u.Paciente.Dni.ToString(),
                    Telefono = u.Paciente.Telefono == null ? "Sin Telefono" : u.Paciente.Telefono.ToString()
                })
                .ToListAsync();
            return Results.Ok(users);
        });

        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var user = await db.Usuarios
                .Include(u => u.Rol)
                .Include(u => u.Paciente)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (user is null) return Results.NotFound();

            return Results.Ok(new UserDto
            {
                Id = user.IdUsuario,
                Nombre = user.Nombre ?? "Sin Nombre",
                Email = user.Email,
                Rol = user.Rol != null ? (user.Rol.Nombre ?? "Sin Rol") : "Sin Rol",
                RolId = user.RolId,
                Dni = user.Paciente.Dni == null ? "Sin DNI" : user.Paciente.Dni.ToString(),
                Telefono = user.Paciente.Telefono == null ? "Sin Telefono" : user.Paciente.Telefono.ToString()
            });
        });

        group.MapPost("/", async (CreateUserDto dto, AppDbContext db, Pass passService) =>
        {
            var existingUser = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser is not null) return Results.BadRequest("Email already exists");

            var user = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = passService.HashPassword(dto.Password),
                RolId = dto.RolId
            };
            if (user.RolId == 3)
            {
                var paciente = new Paciente
                {
                    Nombre = dto.Nombre,
                    Dni = dto.Dni.ToString(),
                    Telefono = dto.Telefono,
                    Email = dto.Email,

                };

                db.Usuarios.Add(user);
                await db.SaveChangesAsync();
                user.Paciente = paciente;
                db.Pacientes.Add(paciente);
                await db.SaveChangesAsync();

            }
            else
            {
                db.Usuarios.Add(user);
                await db.SaveChangesAsync();
            }

            return Results.Created($"/api/users/{user.IdUsuario}", new UserDto
                {
                    Id = user.IdUsuario,
                    Nombre = user.Nombre,
                    Email = user.Email,
                    RolId = user.RolId,
                    Dni = user.Paciente?.Dni ?? "",
                    Telefono = user.Paciente?.Telefono ?? ""
                });
        });

        group.MapPut("/{id}", async (int id, UpdateUserDto dto, AppDbContext db) =>
        {
            var user = await db.Usuarios.FindAsync(id);
            if (user is null) return Results.NotFound();

            user.Nombre = dto.Nombre;
            user.Email = dto.Email;
            user.RolId = dto.RolId;
            user.Paciente.Dni = dto.Dni ?? "";
            user.Paciente.Telefono = dto.Telefono ?? "";
            user.Paciente.Email = dto.Email;

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var user = await db.Usuarios.Include(u => u.Paciente).FirstOrDefaultAsync(u => u.IdUsuario == id);
            if (user is null) return Results.NotFound();

            db.Usuarios.Remove(user);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
