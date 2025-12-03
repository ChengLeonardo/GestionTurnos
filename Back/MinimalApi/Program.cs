using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Biblioteca;
using DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using MinimalApi.Endpoints;
using MinimalApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // tu app React
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddScoped<Pass>();
builder.Services.AddControllers();
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

// HABILITAR SWAGGER ANTES DE TODO (OPCIONAL PERO ORDENADO)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gestión de Turnos v1");
    c.RoutePrefix = "swagger";
});

// CORS – antes de controllers
app.UseCors("AllowReactApp");

// Archivos estáticos si los necesitás
app.UseStaticFiles();

// 🔐 AUTENTICACIÓN Y AUTORIZACIÓN (ORDEN CORRECTO)
app.UseAuthentication();
app.UseAuthorization();

// 🧾 TU MIDDLEWARE DE AUDITORÍA (DESPUÉS DE AUTH/ROLE)
app.UseAuditLog();

// Middleware opcional para “excepciones” de autenticación global
// Si quisieras permitir login sin token, se haría acá PERO BIEN ESCRITO:
app.Use(async (context, next) =>
{
    // Dejar pasar sin token solo /api/auth/login y tal vez /swagger, etc.
    var path = context.Request.Path.Value?.ToLower() ?? "";

    if (path.StartsWith("/api/auth/login") ||
        path.StartsWith("/swagger") ||
        path == "/")
    {
        await next();
        return;
    }

    // En la práctica, la autorización la manejan [Authorize] y las policies,
    // así que este middleware podría NO hacer nada y lo quitamos si no ayuda.

    await next();
});

// ENDPOINT RAÍZ OPCIONAL
app.MapGet("/", (Pass pass) => Results.Ok("API Gestión de Turnos funcionando ✅"));

// ⬇️⬇️ Mapeo de endpoints de controladores y endpoints minimal API ⬇️⬇️

// Controllers (AuthController, etc.)
app.MapControllers();

// Endpoints de extensión
app.MapUsersEndpoints();
app.MapRolesEndpoints();
app.MapOrdenesEndpoints();
app.MapAuditEndpoints();
app.MapAgendaMedicaEndpoints();
app.MapPacientesEndpoints();

// Profesionales
app.MapGet("/profesionales", async (AppDbContext db) => await db.Profesionales
    .Include(p => p.AgendaMedicas)
    .ThenInclude(p => p.Sede)
    .ToListAsync());

app.MapGet("/profesionales/{id}", async (int id, AppDbContext db) =>
{
    var prof = await db.Profesionales.Where(p => p.IdProfesional == id).FirstOrDefaultAsync();
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
    var prof = await db.Profesionales.Where(p => p.IdProfesional == id).FirstOrDefaultAsync();
    if (prof is null) return Results.NotFound();

    prof.Nombre = data.Nombre;
    await db.SaveChangesAsync();
    var agendaMedica = await db.AgendaMedicas.Where(a => a.IdProfesional == prof.IdProfesional).FirstOrDefaultAsync();
    var especialidad = await db.Especialidades.Where(e => e.IdEspecialidad == agendaMedica.IdEspecialidad).FirstOrDefaultAsync();
    return Results.Ok(prof);
});

app.MapDelete("/profesionales/{id}", async (int id, AppDbContext db) =>
{
    var prof = await db.Profesionales.Where(p => p.IdProfesional == id).FirstOrDefaultAsync();
    if (prof is null) return Results.NotFound();

    db.Profesionales.Remove(prof);
    await db.SaveChangesAsync();
    return Results.Ok("Profesional eliminado");
});

// Sedes
app.MapGet("/sedes", async (AppDbContext db) => await db.Sedes.ToListAsync());
app.MapPost("/sedes", async (Sede sede, AppDbContext db) =>
{
    db.Sedes.Add(sede);
    await db.SaveChangesAsync();
    return Results.Created($"/sedes/{sede.IdSede}", sede);
});
app.MapPut("/sedes/{id}", async (int id, Sede data, AppDbContext db) =>
{
    var s = await db.Sedes.Where(s => s.IdSede == id).FirstOrDefaultAsync();
    if (s is null) return Results.NotFound();
    s.Nombre = data.Nombre;
    s.Direccion = data.Direccion;
    await db.SaveChangesAsync();
    return Results.Ok(s);
});
app.MapDelete("/sedes/{id}", async (int id, AppDbContext db) =>
{
    var s = await db.Sedes.Where(s => s.IdSede == id).FirstOrDefaultAsync();
    if (s is null) return Results.NotFound();
    db.Sedes.Remove(s);
    await db.SaveChangesAsync();
    return Results.Ok("Sede eliminada");
});

// Especialidades
app.MapGet("/especialidades", async (AppDbContext db) => await db.Especialidades.ToListAsync());
app.MapPost("/especialidades", async (Especialidad esp, AppDbContext db) =>
{
    db.Especialidades.Add(esp);
    await db.SaveChangesAsync();
    return Results.Created($"/especialidades/{esp.IdEspecialidad}", esp);
});
app.MapPut("/especialidades/{id}", async (int id, Especialidad data, AppDbContext db) =>
{
    var e = await db.Especialidades.Where(e => e.IdEspecialidad == id).FirstOrDefaultAsync();
    if (e is null) return Results.NotFound();
    e.Nombre = data.Nombre;
    await db.SaveChangesAsync();
    return Results.Ok(e);
});
app.MapDelete("/especialidades/{id}", async (int id, AppDbContext db) =>
{
    var e = await db.Especialidades.Where(e => e.IdEspecialidad == id).FirstOrDefaultAsync();
    if (e is null) return Results.NotFound();
    db.Especialidades.Remove(e);
    await db.SaveChangesAsync();
    return Results.Ok("Especialidad eliminada");
});

// Turnos
app.MapGet("/turnos", async (AppDbContext db) =>
    await db.Turnos
        .Include(t => t.AgendaMedica)
        .Include(t => t.Paciente)
        .Include(t => t.AgendaMedica.Sede)
        .Include(t => t.AgendaMedica.Especialidad)
        .Select(t => new TurnoDto
        {
            IdTurno = t.IdTurno,
            Fecha = t.Fecha,
            NroTurno = t.NroTurno,
            IdAgendaMedica = t.IdAgendaMedica,
            IdSede = t.AgendaMedica.IdSede,
            Sede = t.AgendaMedica.Sede.Nombre,
            Especialidad = t.AgendaMedica.Especialidad.Nombre,
            ProfesionalNombre = t.AgendaMedica.Profesional.Nombre ?? "",
            PacienteNombre = t.Paciente.Nombre ?? "",
            IdPaciente = t.IdPaciente,
            IdProfesional = t.AgendaMedica.IdProfesional,
            Estado = t.Estado.ToString(),
            HoraInicio = t.AgendaMedica.InicioTurno.Add(TimeSpan.FromMinutes(t.NroTurno * t.AgendaMedica.DuracionTurno)),
            HoraFin = t.AgendaMedica.InicioTurno.Add(TimeSpan.FromMinutes(t.NroTurno * t.AgendaMedica.DuracionTurno + t.AgendaMedica.DuracionTurno))
        }).ToListAsync());

app.MapPost("/turnos", async (Turno turno, AppDbContext db) =>
{
    var agendaMedica = await db.AgendaMedicas.FindAsync(turno.IdAgendaMedica);
    if (agendaMedica != null)
    {
        var especialidad = await db.Especialidades.FindAsync(agendaMedica.IdEspecialidad);
        if (especialidad != null && especialidad.Nombre.Contains("Kinesiologia", StringComparison.OrdinalIgnoreCase))
        {
            var orden = await db.Ordenes
                .Where(o => o.IdPaciente == turno.IdPaciente && o.Practica == "Kinesiologia" && o.Autorizada && !o.Usada)
                .OrderByDescending(o => o.FechaSubida)
                .FirstOrDefaultAsync();

            if (orden == null)
            {
                return Results.BadRequest("Se requiere una orden médica autorizada y válida (no usada) para Kinesiología.");
            }

            orden.Usada = true;
            db.Ordenes.Update(orden);
        }
    }

    db.Turnos.Add(turno);
    await db.SaveChangesAsync();

    var turnoConDatos = await db.Turnos.Where(t => t.IdTurno == turno.IdTurno)
        .Include(t => t.AgendaMedica)
        .Include(t => t.Paciente)
        .Include(t => t.AgendaMedica.Sede)
        .Include(t => t.AgendaMedica.Especialidad)
        .Select(t => new TurnoDto
        {
            IdTurno = t.IdTurno,
            Fecha = t.Fecha,
            NroTurno = t.NroTurno,
            IdAgendaMedica = t.IdAgendaMedica,
            IdSede = t.AgendaMedica.IdSede,
            Sede = t.AgendaMedica.Sede.Nombre,
            Especialidad = t.AgendaMedica.Especialidad.Nombre,
            ProfesionalNombre = t.AgendaMedica.Profesional.Nombre ?? "",
            PacienteNombre = t.Paciente.Nombre ?? "",
            IdPaciente = t.IdPaciente,
            IdProfesional = t.AgendaMedica.IdProfesional,
            Estado = t.Estado.ToString(),
            HoraInicio = t.AgendaMedica.InicioTurno.Add(TimeSpan.FromMinutes(t.NroTurno * t.AgendaMedica.DuracionTurno)),
            HoraFin = t.AgendaMedica.InicioTurno.Add(TimeSpan.FromMinutes(t.NroTurno * t.AgendaMedica.DuracionTurno + t.AgendaMedica.DuracionTurno))
        }).FirstOrDefaultAsync();

    return Results.Ok(turnoConDatos);
});

app.MapPut("/turnos/{id}", async (int id, Turno data, AppDbContext db) =>
{
    var t = await db.Turnos.Where(t => t.IdTurno == id).FirstOrDefaultAsync();
    if (t is null) return Results.NotFound();
    t.Fecha = data.Fecha;
    t.NroTurno = data.NroTurno;
    t.IdAgendaMedica = data.IdAgendaMedica;
    t.IdPaciente = data.IdPaciente;
    t.Estado = data.Estado;
    await db.SaveChangesAsync();

    var turnoConDatos = await db.Turnos.Where(t => t.IdTurno == id)
        .Include(t => t.AgendaMedica)
        .Include(t => t.Paciente)
        .Include(t => t.AgendaMedica.Sede)
        .Include(t => t.AgendaMedica.Especialidad)
        .Select(t => new TurnoDto
        {
            IdTurno = t.IdTurno,
            Fecha = t.Fecha,
            NroTurno = t.NroTurno,
            IdAgendaMedica = t.IdAgendaMedica,
            IdSede = t.AgendaMedica.IdSede,
            Sede = t.AgendaMedica.Sede.Nombre,
            Especialidad = t.AgendaMedica.Especialidad.Nombre,
            ProfesionalNombre = t.AgendaMedica.Profesional.Nombre ?? "",
            PacienteNombre = t.Paciente.Nombre ?? "",
            IdPaciente = t.IdPaciente,
            IdProfesional = t.AgendaMedica.IdProfesional,
            Estado = t.Estado.ToString(),
            HoraInicio = t.AgendaMedica.InicioTurno.Add(TimeSpan.FromMinutes(t.NroTurno * t.AgendaMedica.DuracionTurno)),
            HoraFin = t.AgendaMedica.InicioTurno.Add(TimeSpan.FromMinutes(t.NroTurno * t.AgendaMedica.DuracionTurno + t.AgendaMedica.DuracionTurno))
        }).FirstOrDefaultAsync();

    return Results.Ok(turnoConDatos);
});

app.MapDelete("/turnos/{id}", async (int id, AppDbContext db) =>
{
    var t = await db.Turnos.Where(t => t.IdTurno == id).FirstOrDefaultAsync();
    if (t is null) return Results.NotFound();
    db.Turnos.Remove(t);
    await db.SaveChangesAsync();

    return Results.Ok("Turno eliminado");
});

app.Run();
