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
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); 

        modelBuilder.Entity<Turno>()
            .Property(t => t.Estado) 
            .HasConversion<string>()  
            .HasMaxLength(20);

        modelBuilder.Entity<Turno>()
            .Property(t => t.RowVersion) // Configuración para RowVersion
            .IsRowVersion(); // (control de concurrencia)
            
        modelBuilder.Entity<Usuario>()
            .HasOne(u => u.Rol)
            .WithMany(r => r.Usuarios)
            .HasForeignKey(u => u.RolId);

    }
}
