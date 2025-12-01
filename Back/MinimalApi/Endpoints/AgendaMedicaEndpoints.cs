using Microsoft.EntityFrameworkCore;
using Biblioteca;
namespace MinimalApi.Endpoints;
public static class AgendaMedicaEndpoints
{
    public static void MapAgendaMedicaEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/agendamedicas");
        group.MapGet("/", async (AppDbContext context) =>
        {
            var agendaMedicas = await context.AgendaMedicas.Include(a => a.Profesional).Include(a => a.Especialidad).Include(a => a.Sede).ToListAsync();
            return Results.Ok(agendaMedicas);
        });
        group.MapPost("/", async (AppDbContext context, AgendaMedica agendaMedica) =>
        {
            context.AgendaMedicas.Add(agendaMedica);
            await context.SaveChangesAsync();
            var agendaMedicaAdd = await context.AgendaMedicas.Include(a => a.Profesional).Include(a => a.Especialidad).Include(a => a.Sede).Where(a => a.IdAgendaMedica == agendaMedica.IdAgendaMedica).FirstAsync();
            return Results.Created($"/{agendaMedicaAdd.IdAgendaMedica}", agendaMedicaAdd);
        });
        group.MapPut("/{id}", async (AppDbContext context, int id, AgendaMedica agendaMedica) =>
        {
            var agendaMedicaUpdate = await context.AgendaMedicas.FindAsync(id);
            if (agendaMedicaUpdate == null)
            {
                return Results.NotFound();
            }
            agendaMedicaUpdate.DuracionTurno = agendaMedica.DuracionTurno;
            agendaMedicaUpdate.FinTurno = agendaMedica.FinTurno;
            agendaMedicaUpdate.InicioTurno = agendaMedica.InicioTurno;
            agendaMedicaUpdate.IdEspecialidad = agendaMedica.IdEspecialidad;
            agendaMedicaUpdate.IdProfesional = agendaMedica.IdProfesional;
            agendaMedicaUpdate.IdSede = agendaMedica.IdSede;
            agendaMedicaUpdate.DiaSemana = agendaMedica.DiaSemana;
            agendaMedicaUpdate.CantidadTurnos = agendaMedica.CantidadTurnos;

            await context.SaveChangesAsync();
            var agendaMedicaAdd = await context.AgendaMedicas.Include(a => a.Profesional).Include(a => a.Especialidad).Include(a => a.Sede).Where(a => a.IdAgendaMedica == id).FirstAsync();
            return Results.Ok(agendaMedicaAdd);
        });
        group.MapDelete("/{id}", async (AppDbContext context, int id) =>
        {
            var agendaMedicaDelete = await context.AgendaMedicas.FindAsync(id);
            if (agendaMedicaDelete == null)
            {
                return Results.NotFound();
            }
            context.AgendaMedicas.Remove(agendaMedicaDelete);
            await context.SaveChangesAsync();
            return Results.Ok(agendaMedicaDelete);
        });
    }
}