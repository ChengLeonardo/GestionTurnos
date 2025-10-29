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
    public int PacienteId {get;set;}
    public string? Practica {get;set;}
    public bool Autorizada {get;set;}
    public DateTime FechaSubida {get;set;}
    public int? DerivadaAProfesionalId {get;set;}
}