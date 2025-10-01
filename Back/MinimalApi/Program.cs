using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Biblioteca;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySqlConnection"),
        new MySqlServerVersion(new Version(8, 0, 29))
    )
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/pacientes", async (AppDbContext db) => await db.Pacientes.ToListAsync());

app.Run();
