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
    public DbSet<AgendaMedica> AgendaMedicas { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Turno>()
            .Property(t => t.Estado)
            .HasConversion<string>()
            .HasMaxLength(20);
            
        modelBuilder.Entity<Turno>()
            .HasOne(t => t.Paciente)
            .WithMany(p => p.Turnos)
            .HasForeignKey(t => t.IdPaciente);

        modelBuilder.Entity<Orden>()
            .HasOne(o => o.Paciente)
            .WithMany(p => p.Ordenes)
            .HasForeignKey(o => o.IdPaciente);

        modelBuilder.Entity<Orden>()
            .Property(o => o.Usada)
            .HasDefaultValue(false);
        
        modelBuilder.Entity<AgendaMedica>()
            .HasOne(a => a.Profesional)
            .WithMany(p => p.AgendaMedicas)
            .HasForeignKey(a => a.IdProfesional);
        
        modelBuilder.Entity<AgendaMedica>()
            .HasOne(a => a.Especialidad)
            .WithMany(e => e.AgendaMedicas)
            .HasForeignKey(a => a.IdEspecialidad);    
        modelBuilder.Entity<AgendaMedica>()
            .HasOne(a => a.Sede)
            .WithMany(s => s.AgendaMedicas)
            .HasForeignKey(a => a.IdSede);
        modelBuilder.Entity<AgendaMedica>()
            .HasMany(a => a.Turnos)
            .WithOne(t => t.AgendaMedica)
            .HasForeignKey(a => a.IdTurno);
        modelBuilder.Entity<AgendaMedica>()
            .Property(a => a.DiaSemana)
            .HasConversion<int>();

    }
}
