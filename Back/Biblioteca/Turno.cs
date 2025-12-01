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
    public DateOnly Fecha {get;set;}
    public int NroTurno {get;set;}
    public int IdAgendaMedica {get;set;}
    public AgendaMedica AgendaMedica {get;set;}
    public int IdPaciente {get;set;}
    public Paciente Paciente {get;set;}
    public TurnoEstado Estado {get;set;}  = TurnoEstado.Solicitado;
}