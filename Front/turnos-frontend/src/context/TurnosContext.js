import { createContext } from "react";

// Crear el contexto
export const TurnosContext = createContext(null);

// Los datos se pueden exportar como funciones o hooks
export const getInitialData = () => ({
  pacientes: [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Sánchez" }
  ],
  profesionales: [
    { id: 1, nombre: "Dra. Gómez" },
    { id: 2, nombre: "Dr. Rodríguez" },
    { id: 3, nombre: "Dra. Torres" }
  ],
  turnos: [
    { id: 1, pacienteId: 1, profesionalId: 1, fecha: "2025-10-05", hora: "10:00" },
    { id: 2, pacienteId: 2, profesionalId: 2, fecha: "2025-10-06", hora: "11:00" }
  ]
});
