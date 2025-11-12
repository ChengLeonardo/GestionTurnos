using Microsoft.EntityFrameworkCore;
using Biblioteca;

namespace MinimalApi.Endpoints;

public static class RolesEndpoints
{
    public static void MapRolesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/roles");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var roles = await db.Rols.ToListAsync();
            return Results.Ok(roles);
        });

        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var rol = await db.Rols.FindAsync(id);
            return rol is not null ? Results.Ok(rol) : Results.NotFound();
        });

        group.MapPost("/", async (Rol rol, AppDbContext db) =>
        {
            db.Rols.Add(rol);
            await db.SaveChangesAsync();
            return Results.Created($"/api/roles/{rol.IdRol}", rol);
        });

        group.MapPut("/{id}", async (int id, Rol rol, AppDbContext db) =>
        {
            var existingRol = await db.Rols.FindAsync(id);
            if (existingRol is null) return Results.NotFound();

            existingRol.Nombre = rol.Nombre;
            await db.SaveChangesAsync();
            return Results.Ok(existingRol);
        });

        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var rol = await db.Rols.FindAsync(id);
            if (rol is null) return Results.NotFound();

            db.Rols.Remove(rol);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
