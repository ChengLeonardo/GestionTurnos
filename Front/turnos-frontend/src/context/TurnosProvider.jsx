import { useState, useEffect } from "react";
import { TurnosContext, getInitialData } from "./TurnosContext";

export function TurnosProvider({ children }) {
  // Cargar datos iniciales (mock)
  const initialData = getInitialData();

  // Leer del localStorage (si existe)
  const storedData = JSON.parse(localStorage.getItem("turnosData")) || initialData;

  // Estados
  const [pacientes, setPacientes] = useState(storedData.pacientes);
  const [profesionales, setProfesionales] = useState(storedData.profesionales);
  const [turnos, setTurnos] = useState(storedData.turnos);

  // 🧩 Sincronizar con localStorage cada vez que cambien los datos
  useEffect(() => {
    const dataToSave = { pacientes, profesionales, turnos };
    localStorage.setItem("turnosData", JSON.stringify(dataToSave));
  }, [pacientes, profesionales, turnos]);

  // Función para agregar un nuevo turno
  const agregarTurno = (nuevoTurno) => {
    setTurnos((prev) => [...prev, { id: Date.now(), ...nuevoTurno }]);
  };

  // Función para eliminar un turno (opcional)
  const eliminarTurno = (id) => {
    setTurnos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TurnosContext.Provider
      value={{
        pacientes,
        setPacientes,
        profesionales,
        setProfesionales,
        turnos,
        setTurnos,
        agregarTurno,
        eliminarTurno
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
}
