using System.Net;
using System.Net.Http.Json;
using Biblioteca;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace GestionTurnos.Tests;

public class IntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public IntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetPacientes_ReturnsOk()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/pacientes");
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task CreateTurno_Kinesiologia_WithoutOrder_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var uniqueId = Guid.NewGuid().ToString().Substring(0, 8);

        // 1. Create a patient
        var paciente = new Paciente { Nombre = $"Test Patient {uniqueId}", Dni = uniqueId, Email = $"test{uniqueId}@test.com", Telefono = "123456" };
        var createPacienteResponse = await client.PostAsJsonAsync("/pacientes", paciente);
        createPacienteResponse.EnsureSuccessStatusCode();
        var createdPaciente = await createPacienteResponse.Content.ReadFromJsonAsync<Paciente>();

        // 2. Create a specialty "Kinesiologia"
        // We need to check if it exists or create a variation. 
        // The logic checks for "Kinesiologia" in the name.
        var especialidad = new Especialidad { Nombre = $"Kinesiologia {uniqueId}" };
        var createEspResponse = await client.PostAsJsonAsync("/especialidades", especialidad);
        createEspResponse.EnsureSuccessStatusCode();
        var createdEsp = await createEspResponse.Content.ReadFromJsonAsync<Especialidad>();

        // 3. Create a professional with that specialty
        // Need a Sede first
        var sede = new Sede { Nombre = $"Sede Test {uniqueId}", Direccion = "Calle Falsa 123" };
        var createSedeResponse = await client.PostAsJsonAsync("/sedes", sede);
        createSedeResponse.EnsureSuccessStatusCode();
        var createdSede = await createSedeResponse.Content.ReadFromJsonAsync<Sede>();

        var profesional = new Profesional { Nombre = $"Test Prof {uniqueId}", IdEspecialidad = createdEsp.IdEspecialidad, IdSede = createdSede.IdSede };
        var createProfResponse = await client.PostAsJsonAsync("/profesionales", profesional);
        createProfResponse.EnsureSuccessStatusCode();
        
        var createdProf = await createProfResponse.Content.ReadFromJsonAsync<DTOs.ProfesionalDto>(); 

        // 4. Try to create a Turno
        var turno = new Turno
        {
            IdPaciente = createdPaciente.IdPaciente,
            IdProfesional = createdProf.IdProfesional,
            FechaHoraInicio = DateTime.Now.AddDays(1),
            FechaHoraFin = DateTime.Now.AddDays(1).AddMinutes(30),
            Estado = TurnoEstado.Solicitado
        };

        var response = await client.PostAsJsonAsync("/turnos", turno);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("Se requiere una orden médica autorizada", content);
    }
}
