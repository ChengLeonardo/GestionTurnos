namespace DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public int RolId { get; set; }
    public string? Dni { get; set; }
    public string? Telefono { get; set; }
}

public class CreateUserDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int RolId { get; set; }
    public string? Dni { get; set; }
    public string? Telefono { get; set; }
}

public class UpdateUserDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int RolId { get; set; }
    public string? Dni { get; set; }
    public string? Telefono { get; set; }
}
