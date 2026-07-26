export class TitanAppError extends Error {
  public code: string;
  public details?: unknown;

  constructor(message: string, code = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.name = "TitanAppError";
    this.code = code;
    this.details = details;
  }
}

export interface ErrorState {
  hasError: boolean;
  message: string | null;
  code: string | null;
}

export function handleAppError(err: unknown): ErrorState {
  if (err instanceof TitanAppError) {
    console.error(`[TITAN ERROR ${err.code}]:`, err.message, err.details);
    return {
      hasError: true,
      message: err.message,
      code: err.code,
    };
  }

  if (err instanceof Error) {
    console.error("[UNHANDLED SYSTEM ERROR]:", err.message);
    return {
      hasError: true,
      message: err.message || "An unexpected system error occurred.",
      code: "UNKNOWN_ERROR",
    };
  }

  console.error("[UNKNOWN ERROR PAYLOAD]:", err);
  return {
    hasError: true,
    message: "Operational system anomaly detected.",
    code: "ANOMALY",
  };
}
