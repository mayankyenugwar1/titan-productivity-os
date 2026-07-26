import { logEvent } from "@/services/telemetry/loggerService";

export function initProductionMonitoring() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    logEvent("ERROR", "WINDOW_ERROR", event.message, { filename: event.filename, lineno: event.lineno });
  });

  window.addEventListener("unhandledrejection", (event) => {
    logEvent("ERROR", "UNHANDLED_REJECTION", event.reason?.message || String(event.reason));
  });

  logEvent("INFO", "MONITORING", "Production telemetry & error handlers initialized successfully");
}
