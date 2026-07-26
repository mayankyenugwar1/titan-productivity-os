export type LogLevel = "INFO" | "WARN" | "ERROR" | "TELEMETRY";

export interface LogPayload {
  level: LogLevel;
  module: string;
  message: string;
  data?: unknown;
  timestamp: string;
}

const LOG_HISTORY: LogPayload[] = [];

export function logEvent(level: LogLevel, module: string, message: string, data?: unknown): LogPayload {
  const entry: LogPayload = {
    level,
    module,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  LOG_HISTORY.unshift(entry);
  if (LOG_HISTORY.length > 200) LOG_HISTORY.pop();

  if (level === "ERROR") {
    console.error(`[${entry.module}] ERROR: ${entry.message}`, data || "");
  } else if (level === "WARN") {
    console.warn(`[${entry.module}] WARN: ${entry.message}`, data || "");
  } else {
    console.log(`[${entry.module}] ${level}: ${entry.message}`);
  }

  return entry;
}

export function getTelemetryLogs(): LogPayload[] {
  return LOG_HISTORY;
}
