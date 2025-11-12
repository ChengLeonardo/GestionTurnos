using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca;
public class Turno
{
    [Key]
    public int IdTurno {get;set;}
    public DateTime FechaHoraInicio {get;set;}
    public DateTime FechaHoraFin {get;set;}
    public int? IdProfesional {get;set;}
    public Profesional Profesional{get;set;}
    public int IdPaciente {get;set;}
    public Paciente Paciente {get;set;}
    public TurnoEstado Estado {get;set;}  = TurnoEstado.Solicitado;
}