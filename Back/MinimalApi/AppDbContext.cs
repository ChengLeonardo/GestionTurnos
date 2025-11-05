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
            .Property(t => t.RowVersion)
            .IsConcurrencyToken()
            .ValueGeneratedOnAddOrUpdate()
            .HasColumnType("varbinary(8)");
            
        modelBuilder.Entity<Turno>()
            .HasOne(t => t.Profesional)
            .WithMany(p => p.Turnos)
            .HasForeignKey(t => t.IdProfesional);
        modelBuilder.Entity<Turno>()
            .HasOne(t => t.Paciente)
            .WithMany(p => p.Turnos)
            .HasForeignKey(t => t.IdPaciente);


    }
}
