using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Biblioteca;
public class AgendaMedica
{
    [Key]
    public int IdAgendaMedica {get;set;}
    public EDiaSemana DiaSemana {get;set;}
    public int IdProfesional {get;set;}
    public Profesional Profesional {get;set;}
    public int IdEspecialidad {get;set;}
    public Especialidad Especialidad {get;set;}
    public int IdSede {get;set;}
    public Sede Sede {get;set;}
    public TimeSpan InicioTurno {get;set;}
    public TimeSpan FinTurno {get;set;}
    public int DuracionTurno {get;set;}
    public int CantidadTurnos {get;set;}
    [JsonIgnore]
    public List<Turno> Turnos {get;set;}
}