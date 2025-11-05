using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MinimalApi.Migrations
{
    /// <inheritdoc />
    public partial class AgregarConexiones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "RowVersion",
                table: "Turnos",
                type: "varbinary(8)",
                rowVersion: true,
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp(6)",
                oldRowVersion: true);

            migrationBuilder.AddColumn<int>(
                name: "EspecialidadIdEspecialidad",
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

            migrationBuilder.CreateTable(
                name: "Rols",
                columns: table => new
                {
                    IdRol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rols", x => x.IdRol);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RolId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Rols_RolId",
                        column: x => x.RolId,
                        principalTable: "Rols",
                        principalColumn: "IdRol",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.CreateIndex(
                name: "IX_Ordenes_PacienteId",
                table: "Ordenes",
                column: "PacienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_RolId",
                table: "Usuarios",
                column: "RolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ordenes_Pacientes_PacienteId",
                table: "Ordenes",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "IdPaciente",
                onDelete: ReferentialAction.Cascade);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ordenes_Pacientes_PacienteId",
                table: "Ordenes");

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

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Rols");

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

            migrationBuilder.DropIndex(
                name: "IX_Ordenes_PacienteId",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "EspecialidadIdEspecialidad",
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

            migrationBuilder.AlterColumn<DateTime>(
                name: "RowVersion",
                table: "Turnos",
                type: "timestamp(6)",
                rowVersion: true,
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(8)",
                oldRowVersion: true);
        }
    }
}
