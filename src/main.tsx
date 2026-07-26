import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/index.css";
import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import { initProductionMonitoring } from "@/services/devops/monitoringService";

document.documentElement.classList.add("dark");

// Initialize Production Telemetry & Monitoring Handlers
initProductionMonitoring();

// Service Worker Registration for PWA & Desktop Installability
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("[TITAN PWA] Service worker registered: ", reg.scope))
      .catch((err) => console.warn("[TITAN PWA] Service worker registration failed: ", err));
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);