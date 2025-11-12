namespace DTOs;

public class OrdenDto
{
    public int Id { get; set; }
    public int IdPaciente { get; set; }
    public string PacienteNombre { get; set; } = string.Empty;
    public string Practica { get; set; } = string.Empty;
    public bool Autorizada { get; set; }
    public DateTime FechaSubida { get; set; }
    public int? DerivadaAProfesionalId { get; set; }
    public string? DerivadaAProfesionalNombre { get; set; }
}

public class CreateOrdenDto
{
    public int IdPaciente { get; set; }
    public string Practica { get; set; } = string.Empty;
}

public class UpdateOrdenDto
{
    public bool Autorizada { get; set; }
    public int? DerivadaAProfesionalId { get; set; }
}
