namespace DTOs;

public class TurnoDto
{
    public int IdTurno { get; set; }
    public DateTime FechaHoraInicio { get; set; }
    public DateTime FechaHoraFin { get; set; }
    public string ProfesionalNombre { get; set; }
    public string PacienteNombre { get; set; }
    public int IdPaciente { get; set; }
    public int? IdProfesional { get; set; }
    public int IdSede { get; set; }
    public string? Sede { get; set; }
    public string? Especialidad { get; set; }
    public string? Estado { get; set; }
}
public class ProfesionalDto 
{
    public int IdProfesional { get; set; }
    public int IdEspecialidad { get; set; }
    public int IdSede { get; set; }
    public string? Nombre { get; set; }
    public string? Especialidad { get; set; }
    public string? Sede { get; set; }
    public string? Direccion { get; set; }
}