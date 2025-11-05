using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Biblioteca;
using DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // tu app React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<Pass>();

// Conexión MySQL 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQL"),
        new MySqlServerVersion(new Version(8, 0, 29))
    )
);

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

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    // fuerza autenticación global, excepto login o rutas públicas
    if (context.Request.Path.StartsWithSegments("/api//login"))
        await next();
    else
        await next();
});

app.UseCors("AllowReactApp");


app.UseStaticFiles();

// Activar Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gestión de Turnos v1");
    c.RoutePrefix = "swagger";
});

// Endpoint raíz opcional para probar
app.MapGet("/", (Pass pass) => Results.Ok("API Gestión de Turnos funcionando ✅"));

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

// Profesionales
app.MapGet("/profesionales", async (AppDbContext db) => await db.Profesionales
    .Include(p => p.Especialidad)
    .Include(p => p.Sede)
    .ToListAsync());

app.MapGet("/profesionales/{id}", async (int id, AppDbContext db) =>
{
    var prof = await db.Profesionales.FindAsync(id);
    return prof is not null ? Results.Ok(prof) : Results.NotFound("Profesional no encontrado");
});

app.MapPost("/profesionales", async (Profesional prof, AppDbContext db) =>
{
    db.Profesionales.Add(prof);
    await db.SaveChangesAsync();
    return Results.Created($"/profesionales/{prof.IdProfesional}", prof);
});

app.MapPut("/profesionales/{id}", async (int id, Profesional data, AppDbContext db) =>
{
    var prof = await db.Profesionales.FindAsync(id);
    if (prof is null) return Results.NotFound();

    prof.Nombre = data.Nombre;
    prof.IdEspecialidad = data.IdEspecialidad;
    prof.IdSede = data.IdSede;
    await db.SaveChangesAsync();

    return Results.Ok(prof);
});

app.MapDelete("/profesionales/{id}", async (int id, AppDbContext db) =>
{
    var prof = await db.Profesionales.FindAsync(id);
    if (prof is null) return Results.NotFound();

    db.Profesionales.Remove(prof);
    await db.SaveChangesAsync();
    return Results.Ok("Profesional eliminado");
});

// Sede
app.MapGet("/sedes", async (AppDbContext db) => await db.Sedes.ToListAsync());
app.MapPost("/sedes", async (Sede sede, AppDbContext db) =>
{
    db.Sedes.Add(sede);
    await db.SaveChangesAsync();
    return Results.Created($"/sedes/{sede.IdSede}", sede);
});
app.MapPut("/sedes/{id}", async (int id, Sede data, AppDbContext db) =>
{
    var s = await db.Sedes.FindAsync(id);
    if (s is null) return Results.NotFound();
    s.Nombre = data.Nombre;
    s.Direccion = data.Direccion;
    await db.SaveChangesAsync();
    return Results.Ok(s);
});
app.MapDelete("/sedes/{id}", async (int id, AppDbContext db) =>
{
    var s = await db.Sedes.FindAsync(id);
    if (s is null) return Results.NotFound();
    db.Sedes.Remove(s);
    await db.SaveChangesAsync();
    return Results.Ok("Sede eliminada");
});

// Especialidad

app.MapGet("/especialidades", async (AppDbContext db) => await db.Especialidades.ToListAsync());
app.MapPost("/especialidades", async (Especialidad esp, AppDbContext db) =>
{
    db.Especialidades.Add(esp);
    await db.SaveChangesAsync();
    return Results.Created($"/especialidades/{esp.IdEspecialidad}", esp);
});
app.MapPut("/especialidades/{id}", async (int id, Especialidad data, AppDbContext db) =>
{
    var e = await db.Especialidades.FindAsync(id);
    if (e is null) return Results.NotFound();
    e.Nombre = data.Nombre;
    await db.SaveChangesAsync();
    return Results.Ok(e);
});
app.MapDelete("/especialidades/{id}", async (int id, AppDbContext db) =>
{
    var e = await db.Especialidades.FindAsync(id);
    if (e is null) return Results.NotFound();
    db.Especialidades.Remove(e);
    await db.SaveChangesAsync();
    return Results.Ok("Especialidad eliminada");
});

// Turnos

app.MapGet("/turnos", async (AppDbContext db) =>
    await db.Turnos
    .Include(t => t.Profesional)
    .Include(t => t.Paciente)
    .Select(t => new TurnoDto {
                    Id = t.IdTurno,
            FechaHoraInicio = t.FechaHoraInicio,
            FechaHoraFin = t.FechaHoraFin,
            ProfesionalNombre = t.Profesional.Nombre ?? "",
            PacienteNombre = t.Paciente.Nombre ?? ""
    }).ToListAsync());

app.MapPost("/turnos", async (Turno turno, AppDbContext db) =>
{
    db.Turnos.Add(turno);
    await db.SaveChangesAsync();
    return Results.Created($"/turnos/{turno.IdTurno}", turno);
});

app.MapPut("/turnos/{id}", async (int id, Turno data, AppDbContext db) =>
{
    var t = await db.Turnos.FindAsync(id);
    if (t is null) return Results.NotFound();
    t.FechaHoraInicio = data.FechaHoraInicio;
    t.FechaHoraFin = data.FechaHoraFin;
    t.IdProfesional = data.IdProfesional;
    t.IdPaciente = data.IdPaciente;
    t.Estado = data.Estado;
    await db.SaveChangesAsync();
    return Results.Ok(t);
});

app.MapDelete("/turnos/{id}", async (int id, AppDbContext db) =>
{
    var t = await db.Turnos.FindAsync(id);
    if (t is null) return Results.NotFound();
    db.Turnos.Remove(t);
    await db.SaveChangesAsync();
    return Results.Ok("Turno eliminado");
});


app.Run();
