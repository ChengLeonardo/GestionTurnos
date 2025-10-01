import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Turnos from "./pages/Turnos";
import Pacientes from "./pages/Pacientes";
import Profesionales from "./pages/Profesionales";
import Reportes from "./pages/Reportes";

export default function App() {
  return (
    <div>
      {/* Mostramos Navbar en todas las páginas excepto Login */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/turnos" element={<Turnos />} />
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/profesionales" element={<Profesionales />} />
                <Route path="/reportes" element={<Reportes />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}
