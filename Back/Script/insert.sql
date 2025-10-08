USE gestion_turnos;

-- Insertar algunas sedes
INSERT INTO sede (Nombre, Direccion)
VALUES ('Sede Central', 'Av. Siempre Viva 123'),
        ('Sede Norte', 'Ruta 9 Km 45');

-- Insertar especialidades
INSERT INTO especialidad (Nombre)
VALUES ('Cardiologia'),
        ('Kinesiologia'),
        ('Clinica Medica');

-- Insertar profesionales
INSERT INTO profesional (Nombre, IdEspecialidad, IdSede)
VALUES ('Dr. Juan Perez', 1, 1),
        ('Dra. Maria Lopez', 2, 2),
        ('Dr. Zhamira Zambrano', 3, 1);

-- Insertar pacientes
INSERT INTO paciente (Nombre, Dni, Telefono, Email)
VALUES ('Ana Torres', '40111222', '1133445566', 'ana@mail.com'),
        ('Luis Fernandez', '38222111', '1144556677', 'luis@mail.com');

-- Insertar turnos
INSERT INTO turno (FechaHoraInicio, FechaHoraFin, IdEspecialidad, IdSede, IdProfesional, IdPaciente, Estado)
VALUES ('2025-10-02 09:00:00', '2025-10-02 09:30:00', 1, 1, 1, 1, 'Solicitado'),
        ('2025-10-02 10:00:00', '2025-10-02 10:30:00', 2, 2, 2, 2, 'Confirmado');

-- Insertar órdenes
INSERT INTO orden (PacienteId, Practica, Autorizada, FechaSubida)
VALUES (1, 'Kinesiologia', TRUE, NOW()),
        (2, 'Cardiologia', FALSE, NOW());
