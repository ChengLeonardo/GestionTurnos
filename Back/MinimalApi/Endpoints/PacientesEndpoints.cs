using DTOs;
using Biblioteca;
using MinimalApi.Middleware;
using Microsoft.EntityFrameworkCore;

namespace MinimalApi.Endpoints;

public static class PacientesEndpoints
{
    public static void MapPacientesEndpoints(this WebApplication app)
    {
        
        var group = app.MapGroup("/pacientes");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var pacientes = await db.Pacientes.ToListAsync();
            return Results.Ok(pacientes);
        });

        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var p = await db.Pacientes.Where(p => p.IdPaciente == id).FirstOrDefaultAsync();
            return p is not null ? Results.Ok(p) : Results.NotFound("Paciente no encontrado");
        });

        group.MapPost("/", async (PacienteAltaDto paciente, AppDbContext db, Pass passService) =>
        {
            var pacienteNuevo = new Paciente
            {
                Nombre = paciente.Nombre,
                Dni = paciente.Dni.ToString(),
                Email = paciente.Email.ToString(),
                Telefono = paciente.Telefono.ToString(),
            };
            var usuario = new Usuario
            {
                Nombre = paciente.Nombre,
                Email = paciente.Email.ToString(),
                RolId = 3,
                PasswordHash = passService.HashPassword(paciente.Contrasena),
                Paciente = pacienteNuevo
            };
            db.Pacientes.Add(pacienteNuevo);
            await db.SaveChangesAsync();
            db.Usuarios.Add(usuario);
            await db.SaveChangesAsync();
            return Results.Created($"/pacientes/{pacienteNuevo.IdPaciente}", pacienteNuevo);
        });

        group.MapPut("/{id}", async (int id, PacienteAltaDto data, AppDbContext db, Pass passService) =>
        {
            var usuario = await db.Usuarios.Where(u => u.IdPaciente == id).FirstOrDefaultAsync();
            var p = await db.Pacientes.FindAsync(id);
            if (p is null) return Results.NotFound("Paciente no encontrado");

            p.Nombre = data.Nombre;
            p.Dni = data.Dni.ToString();
            p.Telefono = data.Telefono.ToString();
            p.Email = data.Email.ToString();

            usuario.Nombre = data.Nombre;
            usuario.Email = data.Email.ToString();
            usuario.PasswordHash = passService.HashPassword(data.Contrasena);
            await db.SaveChangesAsync();
            return Results.Ok(p);
        });

        group.MapDelete("/{id}", async (int id, AppDbContext db, Pass passService) =>
        {
            var usuario = await db.Usuarios.Where(u => u.IdPaciente == id).FirstOrDefaultAsync();
            var p = await db.Pacientes.FindAsync(id);
            if (p is null) return Results.NotFound("Paciente no encontrado");

            db.Pacientes.Remove(p);
            db.Usuarios.Remove(usuario);
            await db.SaveChangesAsync();
            return Results.Ok("Paciente eliminado correctamente");
        });
    }
}