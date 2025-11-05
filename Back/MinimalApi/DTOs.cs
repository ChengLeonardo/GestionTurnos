namespace DTOs;

public class TurnoDto
{
    public int Id { get; set; }
    public DateTime FechaHoraInicio { get; set; }
    public DateTime FechaHoraFin { get; set; }
    public string ProfesionalNombre { get; set; }
    public string PacienteNombre { get; set; }
}
