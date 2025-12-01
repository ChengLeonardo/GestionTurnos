using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca;
public class Orden
{
    [Key]
    public int Id {get;set;}
    public int IdPaciente {get;set;}
    public Paciente Paciente {get;set;}
    public string? Practica {get;set;}
    public bool Autorizada {get;set;}
    public bool Usada {get;set;} = false;
    public DateTime FechaSubida {get;set;}
}