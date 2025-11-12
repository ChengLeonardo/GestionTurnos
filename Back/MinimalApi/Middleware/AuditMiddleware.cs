using System.Security.Claims;
using Biblioteca;
using Microsoft.AspNetCore.Http;

namespace MinimalApi.Middleware;

public class AuditMiddleware
{
    private readonly RequestDelegate _next;

    public AuditMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        // Only log modification requests (POST, PUT, DELETE)
        var method = context.Request.Method;
        if (method == "POST" || method == "PUT" || method == "DELETE")
        {
            var user = context.User.Identity?.Name ?? "Anónimo";
            var path = context.Request.Path;

            var log = new AuditLog
            {
                Usuario = user,
                Accion = method,
                Endpoint = path,
                FechaHora = DateTime.Now,
                Detalles = $"Request to {path}"
            };

            db.AuditLogs.Add(log);
            await db.SaveChangesAsync();
        }

        await _next(context);
    }
}

public static class AuditMiddlewareExtensions
{
    public static IApplicationBuilder UseAuditLog(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuditMiddleware>();
    }
}
