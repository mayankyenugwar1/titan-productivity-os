import { safeISOString } from "@/utils/safeDate";

export interface FriendlyAuthResult {
  message: string;
  code: string;
  isRateLimit: boolean;
  isNetworkError: boolean;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***.***";
  const [user, domain] = email.split("@");
  const maskedUser = user.length > 2 ? `${user.substring(0, 2)}***` : `${user}***`;
  return `${maskedUser}@${domain}`;
}

export function logAuthTechnicalError(action: string, error: unknown, email?: string): void {
  const timestamp = safeISOString(new Date());
  const safeEmail = email ? maskEmail(email) : "N/A";
  
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    console.error(`[TITAN AUTH TELEMETRY] [${timestamp}] [ACTION: ${action}] [EMAIL: ${safeEmail}]`, {
      message: err.message || "Unknown error message",
      code: err.code || err.status || "NO_CODE",
      status: err.status || "NO_STATUS",
      name: err.name || "Error",
      stack: err.stack,
    });
  } else {
    console.error(`[TITAN AUTH TELEMETRY] [${timestamp}] [ACTION: ${action}] [EMAIL: ${safeEmail}]`, error);
  }
}

export function parseAuthError(error: unknown, emailContext?: string): FriendlyAuthResult {
  logAuthTechnicalError("AUTH_FAILURE", error, emailContext);

  if (!error) {
    return {
      message: "An unexpected authentication error occurred.",
      code: "UNKNOWN_NULL",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  const errObj = typeof error === "object" ? (error as Record<string, unknown>) : {};
  const msg = String(errObj.message || error || "").toLowerCase();
  const status = Number(errObj.status || 0);
  const code = String(errObj.code || "").toLowerCase();

  // 1. Email Rate Limit Exceeded (HTTP 429 / Supabase Auth Rate Limit)
  if (
    status === 429 ||
    code === "over_email_send_rate_limit" ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("email rate limit exceeded")
  ) {
    return {
      message: "Registration request limit reached. Please wait a few minutes before trying again or contact support.",
      code: "RATE_LIMIT_EXCEEDED",
      isRateLimit: true,
      isNetworkError: false,
    };
  }

  // 2. Email Already Registered / Duplicate Account
  if (
    code === "user_already_exists" ||
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("user already registered")
  ) {
    return {
      message: "An account with this email address already exists. Please sign in instead.",
      code: "USER_ALREADY_EXISTS",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 3. Invalid Email Format
  if (
    code === "validation_failed" ||
    msg.includes("invalid email") ||
    msg.includes("email is invalid") ||
    msg.includes("unable to validate email")
  ) {
    return {
      message: "Please enter a valid email address (e.g. operator@titan.os).",
      code: "INVALID_EMAIL",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 4. Weak Password / Passcode Criteria
  if (
    code === "weak_password" ||
    msg.includes("password should be at least") ||
    msg.includes("weak password") ||
    msg.includes("password is too short")
  ) {
    return {
      message: "Security passcode must be at least 6 characters long.",
      code: "WEAK_PASSWORD",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 5. Invalid Login Credentials
  if (
    code === "invalid_credentials" ||
    msg.includes("invalid login credentials") ||
    msg.includes("invalid email or password")
  ) {
    return {
      message: "Invalid email address or passcode. Please check your credentials and try again.",
      code: "INVALID_CREDENTIALS",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 6. Network Failure / Disconnected
  if (
    !navigator.onLine ||
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network error")
  ) {
    return {
      message: "Network connection error. Please check your internet connection and try again.",
      code: "NETWORK_ERROR",
      isRateLimit: false,
      isNetworkError: true,
    };
  }

  // 7. Timeout / Service Unavailable (500, 502, 503, 504)
  if (status >= 500 || msg.includes("timeout") || msg.includes("gateway")) {
    return {
      message: "Authentication service is temporarily unavailable. Please try again in a moment.",
      code: "SERVICE_UNAVAILABLE",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 8. Fallback Human Readable Error
  return {
    message: "An unexpected error occurred during authentication. Please try again.",
    code: "UNEXPECTED_ERROR",
    isRateLimit: false,
    isNetworkError: false,
  };
}
