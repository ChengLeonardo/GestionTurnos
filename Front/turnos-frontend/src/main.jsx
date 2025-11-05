import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TurnosProvider } from "./context/Turnos/TurnosContext";
import { AuthProvider } from "./context/Auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <TurnosProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </TurnosProvider>
);