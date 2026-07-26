import { logEvent } from "./loggerService";

export function measurePerformanceMark(markName: string): () => void {
  const startTime = performance.now();
  return () => {
    const duration = Math.round(performance.now() - startTime);
    logEvent("TELEMETRY", "PERFORMANCE", `Mark '${markName}' completed in ${duration}ms`, { duration });
  };
}
