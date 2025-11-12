USE Gestion_Turnos;

-- Insertar algunas sedes
INSERT INTO sedes  (Nombre, Direccion)
VALUES ('Sede Central', 'Av. Siempre Viva 123'),
        ('Sede Norte', 'Ruta 9 Km 45');

-- Insertar especialidades
INSERT INTO especialidades (Nombre)
VALUES ('Cardiologia'),
        ('Kinesiologia'),
        ('Clinica Medica');

-- Insertar profesionales
INSERT INTO profesionales (Nombre, IdEspecialidad, IdSede)
VALUES ('Dr. Juan Perez', 1, 1),
        ('Dra. Maria Lopez', 2, 2),
        ('Dr. Zhamira Zambrano', 3, 1);

-- Insertar pacientes
INSERT INTO pacientes (Nombre, Dni, Telefono, Email)
VALUES ('Ana Torres', '40111222', '1133445566', 'ana@mail.com'),
        ('Luis Fernandez', '38222111', '1144556677', 'luis@mail.com');

-- Insertar turnos
INSERT INTO turnos (FechaHoraInicio, FechaHoraFin, IdEspecialidad, IdSede, IdProfesional, IdPaciente, Estado, RowVersion)
VALUES ('2025-10-02 09:00:00', '2025-10-02 09:30:00', 1, 1, 1, 1, 1, '01'),
        ('2025-10-02 10:00:00', '2025-10-02 10:30:00', 2, 2, 2, 2, 0, '01');

-- Insertar órdenes
INSERT INTO ordenes (PacienteId, Practica, Autorizada, FechaSubida)
VALUES (1, 'Kinesiologia', TRUE, NOW()),
        (2, 'Cardiologia', FALSE, NOW());


-- Insertar Roles
INSERT INTO rols (Nombre) VALUES 
('Administrador'),
('Profesional'),
('Recepcion'),
('Paciente');

-- dotnet ef database update desde MinimalApi