import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TurnosProvider } from "./context/TurnosProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <TurnosProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </TurnosProvider>
);