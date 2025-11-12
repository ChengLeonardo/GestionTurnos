USE Gestion_Turnos;

-- Insertar algunas sedes
INSERT INTO sedes (Nombre, Direccion)
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
INSERT INTO turnos (FechaHoraInicio, FechaHoraFin, IdProfesional, IdPaciente, Estado)
VALUES ('2025-10-02 09:00:00', '2025-10-02 09:30:00', 1, 1, 'Solicitado'),
       ('2025-10-02 10:00:00', '2025-10-02 10:30:00', 2, 2, 'Confirmado');

-- Insertar órdenes
INSERT INTO ordenes (IdPaciente, Practica, Autorizada, FechaSubida)
VALUES (1, 'Kinesiologia', TRUE, NOW()),
       (2, 'Cardiologia', FALSE, NOW());

-- Insertar roles (Admin, Asistente, Usuario)
INSERT INTO rols(Nombre)
VALUES ('Admin'),
       ('Asistente'),
       ('Usuario');

-- Insertar usuarios con diferentes roles
-- Password para todos: "admin" -> hash: 8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918
INSERT INTO usuarios(Nombre, Email, PasswordHash, RolId)
VALUES ('Administrador', 'admin@gmail.com', '8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918', 1),
       ('Asistente Maria', 'asistente@gmail.com', '2B302F3E9ADCBB7159BF54D4035260E5DF49EFFEDB1D56F670837EFB25A46E5A', 2),
       ('Paciente Juan', 'paciente@gmail.com', '9250E222C4C71F0C58D4C54B50A880A312E9F9FED55D5C3AA0B0E860DED99165', 3);