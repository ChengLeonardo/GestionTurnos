using Microsoft.EntityFrameworkCore;
using Biblioteca;
using DTOs;

namespace MinimalApi.Endpoints;

public static class OrdenesEndpoints
{
    public static void MapOrdenesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/ordenes");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var ordenes = await db.Ordenes
                .Include(o => o.Paciente)
                .Include(o => o.DerivadaAProfesional)
                .Select(o => new OrdenDto
                {
                    Id = o.Id,
                    IdPaciente = o.IdPaciente,
                    PacienteNombre = o.Paciente.Nombre ?? "Sin Nombre",
                    Practica = o.Practica ?? "",
                    Autorizada = o.Autorizada,
                    FechaSubida = o.FechaSubida,
                    DerivadaAProfesionalId = o.DerivadaAProfesionalId,
                    DerivadaAProfesionalNombre = o.DerivadaAProfesional != null ? o.DerivadaAProfesional.Nombre : null
                })
                .ToListAsync();
            return Results.Ok(ordenes);
        });

        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var orden = await db.Ordenes
                .Include(o => o.Paciente)
                .Include(o => o.DerivadaAProfesional)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orden is null) return Results.NotFound();

            return Results.Ok(new OrdenDto
            {
                Id = orden.Id,
                IdPaciente = orden.IdPaciente,
                PacienteNombre = orden.Paciente.Nombre ?? "Sin Nombre",
                Practica = orden.Practica ?? "",
                Autorizada = orden.Autorizada,
                FechaSubida = orden.FechaSubida,
                DerivadaAProfesionalId = orden.DerivadaAProfesionalId,
                DerivadaAProfesionalNombre = orden.DerivadaAProfesional?.Nombre
            });
        });

        group.MapPost("/", async (CreateOrdenDto dto, AppDbContext db) =>
        {
            var orden = new Orden
            {
                IdPaciente = dto.IdPaciente,
                Practica = dto.Practica,
                FechaSubida = DateTime.Now,
                Autorizada = false
            };

            db.Ordenes.Add(orden);
            await db.SaveChangesAsync();

            return Results.Created($"/api/ordenes/{orden.Id}", new OrdenDto
            {
                Id = orden.Id,
                IdPaciente = orden.IdPaciente,
                Practica = orden.Practica,
                FechaSubida = orden.FechaSubida,
                Autorizada = orden.Autorizada
            });
        });

        group.MapPut("/{id}", async (int id, UpdateOrdenDto dto, AppDbContext db) =>
        {
            var orden = await db.Ordenes.FindAsync(id);
            if (orden is null) return Results.NotFound();

            orden.Autorizada = dto.Autorizada;
            orden.DerivadaAProfesionalId = dto.DerivadaAProfesionalId;

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var orden = await db.Ordenes.FindAsync(id);
            if (orden is null) return Results.NotFound();

            db.Ordenes.Remove(orden);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
