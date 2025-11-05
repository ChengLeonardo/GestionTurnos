using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MinimalApi.Migrations
{
    /// <inheritdoc />
    public partial class AgregarConexionesNecesarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Especialidades_EspecialidadIdEspecialidad",
                table: "Turnos");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Pacientes_PacienteIdPaciente",
                table: "Turnos");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Profesionales_ProfesionalIdProfesional",
                table: "Turnos");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Sedes_SedeIdSede",
                table: "Turnos");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_EspecialidadIdEspecialidad",
                table: "Turnos");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_PacienteIdPaciente",
                table: "Turnos");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_ProfesionalIdProfesional",
                table: "Turnos");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_SedeIdSede",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "EspecialidadIdEspecialidad",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "IdEspecialidad",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "IdSede",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "PacienteIdPaciente",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "ProfesionalIdProfesional",
                table: "Turnos");

            migrationBuilder.DropColumn(
                name: "SedeIdSede",
                table: "Turnos");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_IdPaciente",
                table: "Turnos",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_IdProfesional",
                table: "Turnos",
                column: "IdProfesional");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Pacientes_IdPaciente",
                table: "Turnos",
                column: "IdPaciente",
                principalTable: "Pacientes",
                principalColumn: "IdPaciente",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Profesionales_IdProfesional",
                table: "Turnos",
                column: "IdProfesional",
                principalTable: "Profesionales",
                principalColumn: "IdProfesional");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Pacientes_IdPaciente",
                table: "Turnos");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnos_Profesionales_IdProfesional",
                table: "Turnos");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_IdPaciente",
                table: "Turnos");

            migrationBuilder.DropIndex(
                name: "IX_Turnos_IdProfesional",
                table: "Turnos");

            migrationBuilder.AddColumn<int>(
                name: "EspecialidadIdEspecialidad",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdEspecialidad",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdSede",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PacienteIdPaciente",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProfesionalIdProfesional",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SedeIdSede",
                table: "Turnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_EspecialidadIdEspecialidad",
                table: "Turnos",
                column: "EspecialidadIdEspecialidad");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_PacienteIdPaciente",
                table: "Turnos",
                column: "PacienteIdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_ProfesionalIdProfesional",
                table: "Turnos",
                column: "ProfesionalIdProfesional");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_SedeIdSede",
                table: "Turnos",
                column: "SedeIdSede");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Especialidades_EspecialidadIdEspecialidad",
                table: "Turnos",
                column: "EspecialidadIdEspecialidad",
                principalTable: "Especialidades",
                principalColumn: "IdEspecialidad",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Pacientes_PacienteIdPaciente",
                table: "Turnos",
                column: "PacienteIdPaciente",
                principalTable: "Pacientes",
                principalColumn: "IdPaciente",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Profesionales_ProfesionalIdProfesional",
                table: "Turnos",
                column: "ProfesionalIdProfesional",
                principalTable: "Profesionales",
                principalColumn: "IdProfesional",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Turnos_Sedes_SedeIdSede",
                table: "Turnos",
                column: "SedeIdSede",
                principalTable: "Sedes",
                principalColumn: "IdSede",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
