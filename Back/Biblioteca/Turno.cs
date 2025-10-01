using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca;
public class Turno
{
    public int IdTurno {get;set;}
    public DateTime FechaHoraInicio {get;set;}
    public DateTime FechaHoraFin {get;set;}
    public int IdEspecialidad {get;set;}
    public int IdSede {get;set;}
    public int? IdProfesional {get;set;}
    public int IdPaciente {get;set;}
    public TurnoEstado Estado {get;set;}
    public required byte[] RowVersion {get;set;}
}