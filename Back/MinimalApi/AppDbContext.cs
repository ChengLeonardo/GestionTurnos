using Microsoft.EntityFrameworkCore;
using Biblioteca;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Paciente> Pacientes { get; set; }
    public DbSet<Profesional> Profesionales { get; set; }
    public DbSet<Especialidad> Especialidades { get; set; }
    public DbSet<Sede> Sedes { get; set; }
    public DbSet<Turno> Turnos { get; set; }
    public DbSet<Orden> Ordenes { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Rol> Rols { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); 

        modelBuilder.Entity<Turno>()
            .Property(t => t.Estado) 
            .HasConversion<string>()  
            .HasMaxLength(20);    
            
        modelBuilder.Entity<Turno>()
            .HasOne(t => t.Profesional)
            .WithMany(p => p.Turnos)
            .HasForeignKey(t => t.IdProfesional);
        modelBuilder.Entity<Turno>()
            .HasOne(t => t.Paciente)
            .WithMany(p => p.Turnos)
            .HasForeignKey(t => t.IdPaciente);

        modelBuilder.Entity<Profesional>()
            .HasOne(p => p.Sede)
            .WithMany(s => s.Profesionales)
            .HasForeignKey(p => p.IdSede);

        modelBuilder.Entity<Profesional>()
            .HasOne(p => p.Especialidad)
            .WithMany(e => e.Profesionales)
            .HasForeignKey(p => p.IdEspecialidad);

        modelBuilder.Entity<Sede>()
            .HasMany(s => s.Profesionales)
            .WithOne(p => p.Sede)
            .HasForeignKey(p => p.IdSede);

        modelBuilder.Entity<Especialidad>()
            .HasMany(e => e.Profesionales)
            .WithOne(p => p.Especialidad)
            .HasForeignKey(p => p.IdEspecialidad);

        modelBuilder.Entity<Orden>()
            .HasOne(o => o.Paciente)
            .WithMany(p => p.Ordenes)
            .HasForeignKey(o => o.IdPaciente);

        modelBuilder.Entity<Orden>()
            .HasOne(o => o.DerivadaAProfesional)
            .WithMany(p => p.Ordenes)
            .HasForeignKey(o => o.DerivadaAProfesionalId);
    }
}
