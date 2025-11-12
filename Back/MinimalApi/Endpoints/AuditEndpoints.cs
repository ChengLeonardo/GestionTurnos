using Microsoft.EntityFrameworkCore;
using Biblioteca;

namespace MinimalApi.Endpoints;

public static class AuditEndpoints
{
    public static void MapAuditEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/audit");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var logs = await db.AuditLogs
                .OrderByDescending(l => l.FechaHora)
                .Take(100) // Limit to last 100 logs
                .ToListAsync();
            return Results.Ok(logs);
        });
    }
}
