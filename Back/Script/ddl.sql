CREATE DATABASE IF NOT EXISTS Gestion_Turnos;
USE Gestion_Turnos;

CREATE TABLE Especialidad (
    IdEspecialidad INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Sede (
    IdSede INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Direccion VARCHAR(200)
);

CREATE TABLE Paciente (
    IdPaciente INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Dni VARCHAR(20) NOT NULL UNIQUE,
    Telefono VARCHAR(20),
    Email VARCHAR(100)
);

CREATE TABLE Profesional (
    IdProfesional INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    IdEspecialidad INT NOT NULL,
    IdSede INT NOT NULL,
    FOREIGN KEY (IdEspecialidad) REFERENCES Especialidad(IdEspecialidad),
    FOREIGN KEY (IdSede) REFERENCES Sede(IdSede)
);

CREATE TABLE Turno (
    IdTurno INT AUTO_INCREMENT PRIMARY KEY,
    FechaHoraInicio DATETIME NOT NULL,
    FechaHoraFin DATETIME NOT NULL,
    IdEspecialidad INT NOT NULL,
    IdSede INT NOT NULL,
    IdProfesional INT,
    IdPaciente INT NOT NULL,
    Estado ENUM('Solicitado','Confirmado','Cancelado','Completado') DEFAULT 'Solicitado',
    RowVersion BLOB,
    FOREIGN KEY (IdEspecialidad) REFERENCES Especialidad(IdEspecialidad),
    FOREIGN KEY (IdSede) REFERENCES Sede(IdSede),
    FOREIGN KEY (IdProfesional) REFERENCES Profesional(IdProfesional),
    FOREIGN KEY (IdPaciente) REFERENCES Paciente(IdPaciente)
);

CREATE TABLE Orden (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PacienteId INT NOT NULL,
    Practica VARCHAR(100) NOT NULL,
    Autorizada BOOLEAN DEFAULT FALSE,
    FechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    DerivadaAProfesionalId INT,
    FOREIGN KEY (PacienteId) REFERENCES Paciente(IdPaciente),
    FOREIGN KEY (DerivadaAProfesionalId) REFERENCES Profesional(IdProfesional)
);
