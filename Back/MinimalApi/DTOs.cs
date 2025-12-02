namespace DTOs;

public class TurnoDto
{
    public int IdTurno { get; set; }
    public DateOnly Fecha { get; set; }
    public int NroTurno { get; set; }
    public int IdAgendaMedica { get; set; }
    public string ProfesionalNombre { get; set; }
    public string PacienteNombre { get; set; }
    public int IdPaciente { get; set; }
    public int? IdProfesional { get; set; }
    public int IdSede { get; set; }
    public string? Sede { get; set; }
    public string? Especialidad { get; set; }
    public string? Estado { get; set; }
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFin { get; set; }
}
