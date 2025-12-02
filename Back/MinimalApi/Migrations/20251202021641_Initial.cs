using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MinimalApi.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Usuario = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Accion = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Endpoint = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechaHora = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Detalles = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Especialidades",
                columns: table => new
                {
                    IdEspecialidad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Especialidades", x => x.IdEspecialidad);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Pacientes",
                columns: table => new
                {
                    IdPaciente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Dni = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefono = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacientes", x => x.IdPaciente);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Profesionales",
                columns: table => new
                {
                    IdProfesional = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profesionales", x => x.IdProfesional);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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
                name: "Sedes",
                columns: table => new
                {
                    IdSede = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Direccion = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sedes", x => x.IdSede);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Ordenes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    Practica = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Autorizada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Usada = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    FechaSubida = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ordenes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ordenes_Pacientes_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Pacientes",
                        principalColumn: "IdPaciente",
                        onDelete: ReferentialAction.Cascade);
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
                    RolId = table.Column<int>(type: "int", nullable: false),
                    PacienteIdPaciente = table.Column<int>(type: "int", nullable: true),
                    IdPaciente = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Pacientes_PacienteIdPaciente",
                        column: x => x.PacienteIdPaciente,
                        principalTable: "Pacientes",
                        principalColumn: "IdPaciente");
                    table.ForeignKey(
                        name: "FK_Usuarios_Rols_RolId",
                        column: x => x.RolId,
                        principalTable: "Rols",
                        principalColumn: "IdRol",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AgendaMedicas",
                columns: table => new
                {
                    IdAgendaMedica = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DiaSemana = table.Column<int>(type: "int", nullable: false),
                    IdProfesional = table.Column<int>(type: "int", nullable: false),
                    IdEspecialidad = table.Column<int>(type: "int", nullable: false),
                    IdSede = table.Column<int>(type: "int", nullable: false),
                    InicioTurno = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    FinTurno = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    DuracionTurno = table.Column<int>(type: "int", nullable: false),
                    CantidadTurnos = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgendaMedicas", x => x.IdAgendaMedica);
                    table.ForeignKey(
                        name: "FK_AgendaMedicas_Especialidades_IdEspecialidad",
                        column: x => x.IdEspecialidad,
                        principalTable: "Especialidades",
                        principalColumn: "IdEspecialidad",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AgendaMedicas_Profesionales_IdProfesional",
                        column: x => x.IdProfesional,
                        principalTable: "Profesionales",
                        principalColumn: "IdProfesional",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AgendaMedicas_Sedes_IdSede",
                        column: x => x.IdSede,
                        principalTable: "Sedes",
                        principalColumn: "IdSede",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Turnos",
                columns: table => new
                {
                    IdTurno = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    NroTurno = table.Column<int>(type: "int", nullable: false),
                    IdAgendaMedica = table.Column<int>(type: "int", nullable: false),
                    IdPaciente = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Turnos", x => x.IdTurno);
                    table.ForeignKey(
                        name: "FK_Turnos_AgendaMedicas_IdAgendaMedica",
                        column: x => x.IdAgendaMedica,
                        principalTable: "AgendaMedicas",
                        principalColumn: "IdAgendaMedica",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Turnos_Pacientes_IdPaciente",
                        column: x => x.IdPaciente,
                        principalTable: "Pacientes",
                        principalColumn: "IdPaciente",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AgendaMedicas_IdEspecialidad",
                table: "AgendaMedicas",
                column: "IdEspecialidad");

            migrationBuilder.CreateIndex(
                name: "IX_AgendaMedicas_IdProfesional",
                table: "AgendaMedicas",
                column: "IdProfesional");

            migrationBuilder.CreateIndex(
                name: "IX_AgendaMedicas_IdSede",
                table: "AgendaMedicas",
                column: "IdSede");

            migrationBuilder.CreateIndex(
                name: "IX_Ordenes_IdPaciente",
                table: "Ordenes",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_IdAgendaMedica",
                table: "Turnos",
                column: "IdAgendaMedica");

            migrationBuilder.CreateIndex(
                name: "IX_Turnos_IdPaciente",
                table: "Turnos",
                column: "IdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_PacienteIdPaciente",
                table: "Usuarios",
                column: "PacienteIdPaciente");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_RolId",
                table: "Usuarios",
                column: "RolId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Ordenes");

            migrationBuilder.DropTable(
                name: "Turnos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "AgendaMedicas");

            migrationBuilder.DropTable(
                name: "Pacientes");

            migrationBuilder.DropTable(
                name: "Rols");

            migrationBuilder.DropTable(
                name: "Especialidades");

            migrationBuilder.DropTable(
                name: "Profesionales");

            migrationBuilder.DropTable(
                name: "Sedes");
        }
    }
}
