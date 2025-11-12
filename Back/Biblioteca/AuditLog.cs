using System;
using System.ComponentModel.DataAnnotations;

namespace Biblioteca;

public class AuditLog
{
    [Key]
    public int Id { get; set; }
    public string Usuario { get; set; } = string.Empty;
    public string Accion { get; set; } = string.Empty; // GET, POST, PUT, DELETE
    public string Endpoint { get; set; } = string.Empty;
    public DateTime FechaHora { get; set; }
    public string? Detalles { get; set; }
}
