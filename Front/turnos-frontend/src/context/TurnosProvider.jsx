import { useState } from "react";
import { TurnosContext, getInitialData } from "./TurnosContext";

export function TurnosProvider({ children }) {
  const { pacientes, profesionales, turnos } = getInitialData();

  const [pacientesState, setPacientes] = useState(pacientes);
  const [profesionalesState, setProfesionales] = useState(profesionales);
  const [turnosState, setTurnos] = useState(turnos);

  return (
    <TurnosContext.Provider value={{
      pacientes: pacientesState,
      setPacientes,
      profesionales: profesionalesState,
      setProfesionales,
      turnos: turnosState,
      setTurnos
    }}>
      {children}
    </TurnosContext.Provider>
  );
}
