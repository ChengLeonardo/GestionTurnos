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
INSERT INTO profesionales (Nombre)
VALUES ('Dr. Juan Perez'),
       ('Dra. Maria Lopez'),
       ('Dr. Zhamira Zambrano');

-- Insertar roles (Admin, Asistente, Usuario)
INSERT INTO rols(Nombre)
VALUES ('Admin'),
       ('Asistente'),
       ('Usuario');
-- Insertar usuarios con diferentes roles
-- Password para todos: "admin" -> hash: 8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918
INSERT INTO usuarios(Nombre, Email, PasswordHash, RolId)
VALUES ('Administrador', 'admin@gmail.com', '8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918', 1),
       ('Asistente Maria', 'asistente@gmail.com', '2B302F3E9ADCBB7159BF54D4035260E5DF49EFFEDB1D56F670837EFB25A46E5A',2),
       ('Ana Torres', 'ana@mail.com', '9250E222C4C71F0C58D4C54B50A880A312E9F9FED55D5C3AA0B0E860DED99165', 3),
       ('Luis Fernandez', 'luis@mail.com', '9250E222C4C71F0C58D4C54B50A880A312E9F9FED55D5C3AA0B0E860DED99165', 3);
-- Insertar pacientes
INSERT INTO pacientes (Nombre, Dni, Telefono, Email, IdUsuario)
VALUES ('Ana Torres', '40111222', '1133445566', 'ana@mail.com', 3),
       ('Luis Fernandez', '38222111', '1144556677', 'luis@mail.com', 4);
update usuarios set IdPaciente = 1 where IdUsuario = 3;
update usuarios set IdPaciente = 2 where IdUsuario = 4;
-- Insertar Agendas Medicas
INSERT INTO AgendaMedicas (DiaSemana, IdProfesional, IdEspecialidad, IdSede, InicioTurno, FinTurno, DuracionTurno, CantidadTurnos)
VALUES (1, 1, 1, 1, '09:00:00', '13:00:00', 30, 8),
       (2, 2, 2, 2, '14:00:00', '18:00:00', 30, 8);

-- Insertar turnos
INSERT INTO turnos (Fecha, NroTurno, IdAgendaMedica, IdPaciente, Estado)
VALUES ('2025-10-02', 1, 1, 1, 'Solicitado'),
       ('2025-10-02', 2, 2, 2, 'Confirmado');

-- Insertar órdenes
INSERT INTO ordenes (IdPaciente, Practica, Autorizada, FechaSubida, Usada)
VALUES (1, 'Kinesiologia', TRUE, NOW(), true);

