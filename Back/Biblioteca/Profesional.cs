using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca;
public class Profesional
{
    public int IdProfesional {get;set;}
    public string? Nombre {get;set;}
    public int IdEspecialidad {get;set;}
    public Especialidad? Especialidad {get;set;}
    public int IdSede {get;set;}
    public Sede? Sede {get;set;}
}
