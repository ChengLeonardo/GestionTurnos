using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Biblioteca;

var builder = WebApplication.CreateBuilder(args);

// Conexión a MySQL (Pomelo)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQL"),
        new MySqlServerVersion(new Version(8, 0, 29))
    )
);

// Swagger configurado correctamente
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API Gestión de Turnos",
        Version = "v1",
        Description = "Minimal API para gestionar turnos, pacientes y profesionales."
    });
});

var app = builder.Build();

// Activar Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gestión de Turnos v1");
});

// Endpoint raíz opcional para probar
app.MapGet("/", () => Results.Ok("API Gestión de Turnos funcionando ✅"));

// Pacientes
app.MapGet("/pacientes", async (AppDbContext db) =>
    await db.Pacientes.ToListAsync());

app.MapGet("/pacientes/{id}", async (int id, AppDbContext db) =>
{
    var p = await db.Pacientes.FindAsync(id);
    return p is not null ? Results.Ok(p) : Results.NotFound("Paciente no encontrado");
});

app.MapPost("/pacientes", async (Paciente paciente, AppDbContext db) =>
{
    db.Pacientes.Add(paciente);
    await db.SaveChangesAsync();
    return Results.Created($"/pacientes/{paciente.IdPaciente}", paciente);
});

app.MapPut("/pacientes/{id}", async (int id, Paciente data, AppDbContext db) =>
{
    var p = await db.Pacientes.FindAsync(id);
    if (p is null) return Results.NotFound("Paciente no encontrado");

    p.Nombre = data.Nombre;
    p.Dni = data.Dni;
    p.Telefono = data.Telefono;
    p.Email = data.Email;

    await db.SaveChangesAsync();
    return Results.Ok(p);
});

app.MapDelete("/pacientes/{id}", async (int id, AppDbContext db) =>
{
    var p = await db.Pacientes.FindAsync(id);
    if (p is null) return Results.NotFound("Paciente no encontrado");

    db.Pacientes.Remove(p);
    await db.SaveChangesAsync();
    return Results.Ok("Paciente eliminado correctamente");
});

app.Run();
