import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import "./styles/index.css";
import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import { initProductionMonitoring } from "@/services/devops/monitoringService";

document.documentElement.classList.add("dark");

// Initialize Production Telemetry & Monitoring Handlers
initProductionMonitoring();

// Automatic PWA Service Worker Registration & Update Detection
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("[TITAN PWA] New version available. Dispatching update event...");
    window.dispatchEvent(new CustomEvent("titan-pwa-update-available", { detail: { updateSW } }));
  },
  onOfflineReady() {
    console.log("[TITAN PWA] App is ready for offline usage.");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);