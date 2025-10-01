USE gestion_turnos;

-- Insertar algunas sedes
INSERT INTO Sedes (Nombre, Direccion)
VALUES ('Sede Central', 'Av. Siempre Viva 123'),
        ('Sede Norte', 'Ruta 9 Km 45');

-- Insertar especialidades
INSERT INTO Especialidades (Nombre)
VALUES ('Cardiología'),
        ('Kinesiología'),
        ('Clínica Médica');

-- Insertar profesionales
INSERT INTO Profesionales (Nombre, IdEspecialidad, IdSede)
VALUES ('Dr. Juan Pérez', 1, 1),
        ('Dra. María López', 2, 2),
        ('Dr. Zhamira Zambrano', 3, 1);

-- Insertar pacientes
INSERT INTO Pacientes (Nombre, Dni, Telefono, Email)
VALUES ('Ana Torres', '40111222', '1133445566', 'ana@mail.com'),
        ('Luis Fernández', '38222111', '1144556677', 'luis@mail.com');

-- Insertar turnos
INSERT INTO Turnos (FechaHoraInicio, FechaHoraFin, IdEspecialidad, IdSede, IdProfesional, IdPaciente, Estado)
VALUES ('2025-10-02 09:00:00', '2025-10-02 09:30:00', 1, 1, 1, 1, 'Solicitado'),
        ('2025-10-02 10:00:00', '2025-10-02 10:30:00', 2, 2, 2, 2, 'Confirmado');

-- Insertar órdenes
INSERT INTO Ordenes (PacienteId, Practica, Autorizada, FechaSubida)
VALUES (1, 'Kinesiología', TRUE, NOW()),
        (2, 'Cardiología', FALSE, NOW());
